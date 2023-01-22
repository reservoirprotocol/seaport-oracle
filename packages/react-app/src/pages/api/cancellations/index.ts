import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { recoverCancelRequestSigner } from "../../../eip712";
import { findCancellations, insertCancellation } from "../../../persistence/mongodb";
import { hashOrders, ValidationError } from "../../../seaport";
import { MAX_RETURNED_CANCELLATIONS } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";
import { getTimestamp } from "../../../utils/time";
import { ORDER_CANCELLATION_REQUEST } from "../../../validation/schemas";

const LOGGER = createLogger("cancellations");

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method === "GET") {
      await handleGet();
      return;
    }

    if (req.method != "POST") {
      res.status(501).end();
      return;
    }
    await handlePost();
  } catch (e) {
    LOGGER.error((e as Error).message);
    res.status(500).end();
  }

  async function handleGet() {
    const { lastId } = req.query;
    const cancellations = await findCancellations(MAX_RETURNED_CANCELLATIONS, lastId?.toString());
    res.status(200).json({ cancellations });
  }

  async function handlePost() {
    let data;
    try {
      data = ORDER_CANCELLATION_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error((e as Error).message);
      res.status(400).end();
      return;
    }
    const orders = data.orders;

    const [orderHashes, orderSigner, error] = await hashOrders(orders);

    if (error != ValidationError.NONE) {
      res.status(400).end();
      return;
    }

    LOGGER.info(`orderHashes: ${JSON.stringify(orderHashes)}`);
    LOGGER.info(`orderSigner: ${orderSigner}`);

    const cancelRequestSigner = recoverCancelRequestSigner(orderHashes, data);

    LOGGER.info(`cancelRequestSigner: ${cancelRequestSigner}`);

    if (cancelRequestSigner.toUpperCase() != orderSigner?.toUpperCase()) {
      LOGGER.info(`Cancel signer: ${cancelRequestSigner} is not order signer: ${orderSigner}`);
      res.status(401).end();
      return;
    } else {
      for (let i = 0; i < orderHashes.length; i++) {
        const orderHash = orderHashes[i];
        LOGGER.info(`Inserting: ${orderHash}`);
        await insertCancellation({ orderHash, owner: utils.getAddress(orderSigner), timestamp: getTimestamp() });
      }

      res.status(200).end();
    }
  }
}
