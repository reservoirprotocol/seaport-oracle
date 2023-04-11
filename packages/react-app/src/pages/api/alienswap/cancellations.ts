import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { recoverCancelRequestSigner } from "../../../eip712";
import { chainId } from "../../../eth";
import { cancelOrder } from "../../../features/cancellation";
import { findCancellations } from "../../../persistence/mongodb";
import { hashOrders, ValidationError } from "./utils";
import { ApiError, OrderCancellations } from "../../../types/types";
import { MAX_RETURNED_CANCELLATIONS } from "../../../utils/constants";
import { CONTRACT_ADDRESSES } from "../../../utils/contracts";
import { createLogger } from "../../../utils/logger";
import { getTimestamp } from "../../../utils/time";
import {
  UNSUPPORTED_METHOD_ERROR,
  INTERNAL_SERVER_ERROR,
  ILLEGAL_ARGUMENT_ERROR,
  ORDER_HASHING_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR,
} from "../../../validation/errors";
import { ORDER_CANCELLATION_REQUEST } from "../../../validation/schemas";

const LOGGER = createLogger("cancellations");

export default async function handler(req: NextApiRequest, res: NextApiResponse<OrderCancellations | ApiError | null>) {
  try {
    if (req.method === "GET") {
      await handleGet();
      return;
    }

    if (req.method != "POST") {
      res.status(501).json(UNSUPPORTED_METHOD_ERROR);
      return;
    }
    await handlePost();
  } catch (e) {
    LOGGER.error((e as Error).message);
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }

  async function handleGet() {
    const { fromTimestamp: fromTimestampString } = req.query;
    let fromTimestamp;
    try {
      fromTimestamp = fromTimestampString ? parseInt(fromTimestampString.toString()) : undefined;
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(`${fromTimestampString} is not a valid timestamp`));
      return;
    }
    const cancellations = await findCancellations(MAX_RETURNED_CANCELLATIONS, getTimestamp(), fromTimestamp);
    res.status(200).json({ cancellations });
  }

  async function handlePost() {
    let data;
    try {
      data = ORDER_CANCELLATION_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(`Body could not be parsed`));
      return;
    }

    const orders = data.orders;
    if (orders.some(order => order.zone !== CONTRACT_ADDRESSES[chainId].cancellationZone)) {
      res.status(401).json(UNAUTHORIZED_ERROR);
      return;
    }

    const { orderHashes, orderSigner, error, erroredOrderHash } = await hashOrders(orders);

    if (error != ValidationError.NONE) {
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(ORDER_HASHING_ERROR_MESSAGE(error, erroredOrderHash)));
      return;
    }

    const cancelRequestSigner = recoverCancelRequestSigner(orderHashes!, data);

    if (cancelRequestSigner.toUpperCase() != orderSigner?.toUpperCase()) {
      LOGGER.info(`Cancel signer: ${cancelRequestSigner} is not order signer: ${orderSigner}`);
      res.status(401).json(UNAUTHORIZED_ERROR);
      return;
    } else {
      const cancellations = [];
      const owner = utils.getAddress(orderSigner);

      for (let i = 0; i < orderHashes!.length; i++) {
        const orderHash = orderHashes![i];
        LOGGER.info(`Inserting: ${orderHash}`);
        cancellations.push({ orderHash, owner, timestamp: await cancelOrder(owner, orderHash) });
      }

      res.status(200).json({ cancellations });
    }
  }
}
