import { ReceivedItem } from "@reservoir0x/sdk/dist/seaport/types";
import { utils } from "ethers";
import { BytesLike } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hashConsideration, signOrder } from "../../../eip712";
import { convertSignatureToEIP2098, latestTimestamp } from "../../../eth";
import { Features } from "../../../features/Features";
import { FlaggingChecker } from "../../../features/flagging/FlaggingChecker";
import { isCancelled, trackSignature } from "../../../persistence/mongodb";
import { hashOrder, SIP6_VERSION } from "../../../seaport";
import { ApiError, SignedOrder, SignedOrders } from "../../../types/types";
import { EXPIRATION_IN_S } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";
import { ILLEGAL_ARGUMENT_ERROR, INTERNAL_SERVER_ERROR, UNSUPPORTED_METHOD_ERROR } from "../../../validation/errors";
import { ORDER_SIGNATURE_REQUEST, ORDER_SIGNATURE_REQUEST_ITEM } from "../../../validation/schemas";

const LOGGER = createLogger("sign");
const ZONE_SUBSTANDARD_INDEX = 0;

type SignatureRequestOrder = z.infer<typeof ORDER_SIGNATURE_REQUEST_ITEM>;

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignedOrders | ApiError | null>) {
  try {
    if (req.method != "POST") {
      res.status(501).json(UNSUPPORTED_METHOD_ERROR);
      return;
    }

    let data;

    try {
      data = ORDER_SIGNATURE_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(`Body could not be parsed`));
      return;
    }

    const expiration = (await latestTimestamp()) + EXPIRATION_IN_S;
    const { orders } = data;

    const context: SignatureRequestContext = {
      expiration,
      flaggingChecker: new FlaggingChecker(orders.map(o => o.substandardRequests[0].requestedReceivedItems ?? [])),
    };

    const signedOrders = [];
    for (let i = 0; i < orders.length; i++) {
      signedOrders.push(await processOrder(context, orders[i]));
    }

    res.status(200).json({ orders: signedOrders });
  } catch (e) {
    LOGGER.error((e as Error).message);
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }
}

async function processOrder(
  context: SignatureRequestContext,
  order: SignatureRequestOrder,
): Promise<SignedOrder | ApiError> {
  const { orderParameters, substandardRequests, fulfiller } = order;
  const orderHash = hashOrder(orderParameters);
  const consideration = substandardRequests[ZONE_SUBSTANDARD_INDEX].requestedReceivedItems;
  LOGGER.info(`Processing Order: ${orderHash}`);

  if (await isCancelled(orderHash.toString())) {
    LOGGER.info(`Order: ${orderHash} is cancelled`);
    return CANCELLATION_ERROR(orderHash);
  }

  const features = new Features(orderParameters.zoneHash);

  if (features.checkFlagged()) {
    const flagged = await context.flaggingChecker.containsFlagged(consideration);

    if (flagged) {
      LOGGER.info(`Found flagged token in ${orderHash}'s consideration`);
      return FLAGGING_ERROR(orderHash);
    }
  }

  const [extraDataComponent, requiredReceivedItemsHash] = await encodeExtraData(
    fulfiller,
    context.expiration,
    orderHash,
    consideration,
  );
  await trackSignature({ orderHash, expiration: context.expiration });
  return {
    orderParameters,
    extraDataComponent,
    substandardResponses: [{ requiredReceivedItems: consideration, requiredReceivedItemsHash }],
  };
}

async function encodeExtraData(
  fulfiller: string,
  expiration: number,
  orderHash: string,
  consideration: ReceivedItem[],
) {
  const contextPayload = hashConsideration(consideration);
  const context: BytesLike = encodeContext(0, contextPayload);
  const signature = await signOrder(fulfiller, expiration, orderHash, context);
  const extraData = utils.solidityPack(
    ["bytes1", "address", "uint64", "bytes", "bytes"],
    [SIP6_VERSION, fulfiller, expiration, convertSignatureToEIP2098(signature), context],
  );
  return [extraData, contextPayload];
}

function encodeContext(contextVersion: number, contextPayload: BytesLike) {
  return utils.solidityPack(["bytes1", "bytes"], [contextVersion, contextPayload]);
}
