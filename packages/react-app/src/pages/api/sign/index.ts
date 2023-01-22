import * as Sdk from "@reservoir0x/sdk";
import { OrderComponents, ReceivedItem } from "@reservoir0x/sdk/dist/seaport/types";
import { BytesLike, defaultAbiCoder } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { hashConsideration, signOrder } from "../../../eip712";
import { chainId, convertSignatureToEIP2098, latestTimestamp } from "../../../eth";
import { Features } from "../../../features/features";
import { FlaggingChecker } from "../../../features/flagging/FlaggingChecker";
import { isCancelled } from "../../../persistence/mongodb";
import { ApiError, ExtraData, SignedOrders } from "../../../types/types";
import { EXPIRATION_IN_S } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";
import { ORDER_SIGNATURE_REQUEST } from "../../../validation/schemas";

const LOGGER = createLogger("sign");

const CANCELLATION_ERROR = (orderHash: string) => ({
  orderHash,
  error: "OrderCancelled",
  message: "The order has been cancelled by its creator",
});

const FLAGGING_ERROR = (orderHash: string) => ({
  orderHash,
  error: "FlaggedTokenInConsideration",
  message: "The order cannot be fulfilled with flagged token",
});

type SignatureRequestContext = {
  fulfiller: string;
  expiration: number;
  signedOrders: ExtraData[];
  errors: ApiError[];
  flaggingChecker: FlaggingChecker;
};

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
      LOGGER.error(e);
      res.status(400).end();
      return;
    }

    const expiration = (await latestTimestamp()) + EXPIRATION_IN_S;
    const { orders, considerations, fulfiller } = data;

    const context: SignatureRequestContext = {
      fulfiller,
      expiration,
      signedOrders: [],
      errors: [],
      flaggingChecker: new FlaggingChecker(considerations),
    };

    for (let i = 0; i < orders.length; i++) {
      await processOrder(context, orders[i], considerations[i]);
    }

    res.status(200).json({ orders: context.signedOrders, errors: context.errors });
  } catch (e) {
    LOGGER.error(e);
    res.status(500).end();
  }
}

async function processOrder(
  context: SignatureRequestContext,
  orderData: OrderComponents,
  consideration: ReceivedItem[],
) {
  const order = new Sdk.Seaport.Order(chainId, orderData);
  const orderHash = order.hash();

  LOGGER.info(`Processing Order: ${orderHash}`);

  if (await isCancelled(orderHash.toString())) {
    LOGGER.info(`Order: ${orderHash} is cancelled`);
    context.errors.push(CANCELLATION_ERROR(orderHash));
    return;
  }

  const features = new Features(order.params.zoneHash);
  if (features.checkFlagged()) {
    const flagged = await context.flaggingChecker.containsFlagged(consideration);
    if (flagged) {
      LOGGER.info(`Found flagged token in ${orderHash}'s consideration`);
      context.errors.push(FLAGGING_ERROR(orderHash));
      return;
    }
  }

  const extraData = await encodeExtraData(consideration, context.fulfiller, context.expiration, orderHash);
  context.signedOrders.push({ extraData });
}

async function encodeExtraData(
  consideration: ReceivedItem[],
  fulfiller: string,
  expiration: number,
  orderHash: string,
) {
  const context: BytesLike = hashConsideration(consideration);
  const signature = await signOrder(fulfiller, expiration, orderHash, context);
  const extraData = defaultAbiCoder.encode(
    ["bytes1", "address", "uint64", "bytes", "bytes"],
    [0, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
  );
  return extraData;
}
