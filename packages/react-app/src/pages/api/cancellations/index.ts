import { verifyTypedData } from "ethers/lib/utils";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { chainId } from "../../../eth";
import { findCancellations, insertCancellation } from "../../../persistence/mongodb";
import { HashingError, hashOrders } from "../../../seaport";
import { CANCEL_REQUEST_EIP712_TYPE, EIP712_DOMAIN } from "../../../types/types";
import { MAX_RETURNED_CANCELLATIONS } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";
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
    LOGGER.error(e);
    res.status(500).end();
  }

  async function handleGet() {
    const { lastId } = req.query;
    const cancellations = await findCancellations(MAX_RETURNED_CANCELLATIONS, lastId?.toString());
    res.status(200).json({ cancellations });
  }

  async function handlePost() {
    const data = ORDER_CANCELLATION_REQUEST.parse(req.body);
    const orders = data.orders;
    if (isEmpty(orders)) {
      LOGGER.info("No order found");
      res.status(400).end();
      return;
    }

    const [orderHashes, orderSigner, error] = await hashOrders(orders);

    if (error != HashingError.NONE) {
      res.status(400).end();
      return;
    }

    LOGGER.info(`orderHashes: ${JSON.stringify(orderHashes)}`);
    LOGGER.info(`orderSigner: ${orderSigner}`);

    const cancelRequestSigner = verifyTypedData(
      EIP712_DOMAIN(chainId),
      CANCEL_REQUEST_EIP712_TYPE,
      { orderHashes },
      data.signature,
    );

    LOGGER.info(`cancelRequestSigner: ${cancelRequestSigner}`);

    if (cancelRequestSigner.toUpperCase() != orderSigner?.toUpperCase()) {
      LOGGER.info(`Cancel signer:${cancelRequestSigner} is not order signer: ${orderSigner}`);
      res.status(401).end();
      return;
    } else {
      for (let i = 0; i < orderHashes.length; i++) {
        const orderHash = orderHashes[i];
        LOGGER.info(`Inserting: ${orderHash}`);
        await insertCancellation({ orderHash, owner: cancelRequestSigner, timestamp: new Date().getTime() });
      }

      res.status(200).end();
    }
  }
}
