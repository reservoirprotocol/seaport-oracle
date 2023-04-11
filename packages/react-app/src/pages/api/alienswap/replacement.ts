import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { cancelOrder } from "../../../features/cancellation";
import { getReplacedOrderHashes, ValidationError } from "./utils";
import { ApiError, OrderCancellations } from "../../../types/types";
import { createLogger } from "../../../utils/logger";
import {
  UNSUPPORTED_METHOD_ERROR,
  INTERNAL_SERVER_ERROR,
  ILLEGAL_ARGUMENT_ERROR,
  ORDER_HASHING_ERROR_MESSAGE,
} from "../../../validation/errors";
import { ORDER_REPLACEMENT_REQUEST } from "../../../validation/schemas";

const LOGGER = createLogger("replacements");

export default async function handler(req: NextApiRequest, res: NextApiResponse<OrderCancellations | ApiError | null>) {
  try {
    if (req.method != "POST") {
      res.status(501).json(UNSUPPORTED_METHOD_ERROR);
      return;
    }
    await handlePost();
  } catch (e) {
    LOGGER.error((e as Error).message);
    res.status(500).json(INTERNAL_SERVER_ERROR);
  }

  async function handlePost() {
    let data;
    try {
      data = ORDER_REPLACEMENT_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(`Body could not be parsed`));
      return;
    }
    const { newOrders, replacedOrders } = data;

    if (newOrders.length !== replacedOrders.length) {
      LOGGER.error(`Number of orders do not match`);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(`Number of orders do not match`));
      return;
    }

    const {
      orderHashes: salts,
      orderSigner,
      error,
      erroredOrderHash,
    } = await getReplacedOrderHashes(replacedOrders, newOrders);

    if (error != ValidationError.NONE) {
      LOGGER.error(`Validation Error: ${error}`);
      res.status(400).json(ILLEGAL_ARGUMENT_ERROR(ORDER_HASHING_ERROR_MESSAGE(error, erroredOrderHash)));
      return;
    }

    const cancellations = [];
    const owner = utils.getAddress(orderSigner!);
    for (let i = 0; i < salts!.length; i++) {
      const orderHash = salts![i];
      LOGGER.info(`Cancelling: ${orderHash}`);
      cancellations.push({ orderHash, owner, timestamp: await cancelOrder(owner, orderHash) });
    }

    res.status(200).json({ cancellations });
  }
}
