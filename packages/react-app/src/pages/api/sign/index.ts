import { ReceivedItem } from "@reservoir0x/sdk/dist/seaport/types";
import { BytesLike, defaultAbiCoder } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hashConsideration, signOrder } from "../../../eip712";
import { convertSignatureToEIP2098, latestTimestamp } from "../../../eth";
import { Features } from "../../../features/features";
import { FlaggingChecker } from "../../../features/flagging/FlaggingChecker";
import { isCancelled } from "../../../persistence/mongodb";
import { SignedOrder, SignedOrders } from "../../../types/types";
import { EXPIRATION_IN_S } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";
import { ORDER_SIGNATURE_REQUEST, ORDER_SIGNATURE_REQUEST_ITEM } from "../../../validation/schemas";

const LOGGER = createLogger("sign");

const CANCELLATION_ERROR = (orderHash: string) => ({
  orderHash,
  error: "SignaturesNoLongerVended",
  message: "The order has been cancelled by its creator",
});

const FLAGGING_ERROR = (orderHash: string) => ({
  orderHash,
  error: "FlaggedTokenInConsideration",
  message: "The order cannot be fulfilled with flagged token",
});

type SignatureRequestContext = {
  expiration: number;
  flaggingChecker: FlaggingChecker;
};

type OrderSignatureRequestItem = z.infer<typeof ORDER_SIGNATURE_REQUEST_ITEM>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignedOrders | null>) {
  try {
    if (req.method != "POST") {
      res.status(501).end();
      return;
    }

    let data;

    try {
      data = ORDER_SIGNATURE_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).end();
      return;
    }

    const expiration = (await latestTimestamp()) + EXPIRATION_IN_S;
    const { orders } = data;

    const context: SignatureRequestContext = {
      expiration,
      flaggingChecker: new FlaggingChecker(orders.map(o => o.consideration ?? [])),
    };
    const signedOrders = [];
    for (let i = 0; i < orders.length; i++) {
      signedOrders.push(await processOrder(context, orders[i]));
    }

    res.status(200).json({ orders: signedOrders });
  } catch (e) {
    LOGGER.error((e as Error).message);
    res.status(500).end();
  }
}

async function processOrder(context: SignatureRequestContext, order: OrderSignatureRequestItem): Promise<SignedOrder> {
  const { orderHash, consideration, fulfiller, zoneHash } = order;
  LOGGER.info(`Processing Order: ${orderHash}`);

  if (await isCancelled(orderHash.toString())) {
    LOGGER.info(`Order: ${orderHash} is cancelled`);
    return CANCELLATION_ERROR(orderHash);
  }

  const features = new Features(zoneHash);

  if (features.checkFlagged()) {
    const flagged = await context.flaggingChecker.containsFlagged(consideration);

    if (flagged) {
      LOGGER.info(`Found flagged token in ${orderHash}'s consideration`);
      return FLAGGING_ERROR(orderHash);
    }
  }

  const extraData = await encodeExtraData(fulfiller, context.expiration, orderHash, consideration);
  return { orderHash, extraData };
}

async function encodeExtraData(
  fulfiller: string,
  expiration: number,
  orderHash: string,
  consideration: ReceivedItem[],
) {
  const context: BytesLike = hashConsideration(consideration);
  const signature = await signOrder(fulfiller, expiration, orderHash, context);
  const extraData = defaultAbiCoder.encode(
    ["bytes1", "address", "uint64", "bytes", "bytes"],
    [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
  );
  return extraData;
}
