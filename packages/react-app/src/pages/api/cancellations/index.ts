import { verifyTypedData } from "ethers/lib/utils";
import { isEmpty } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { chainId } from "../../../eth";
import { findCancellations, insertCancellation } from "../../../persistence/mongodb";
import { getOrders } from "../../../reservoir";
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
    const { orderHashes, signature } = ORDER_CANCELLATION_REQUEST.parse(req.body);
    const orders = await getOrders(orderHashes);
    if (isEmpty(orders)) {
      LOGGER.info("No order found");
      res.status(400).end();
      return;
    }
    let orderSigner;
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      try {
        await order.checkSignature();
      } catch (e) {
        LOGGER.info("Wrong Order Signature");
        res.status(400).end();
        return;
      }

      if (!orderSigner) {
        orderSigner = order.params.offerer;
      } else if (order.params.offerer != orderSigner) {
        LOGGER.info(`Inconsistent order signers found: ${order.params.offerer} | ${orderSigner}`);
        res.status(401).end();
        return;
      }

      if (!orderHashes.includes(order.hash())) {
        LOGGER.info(`Orders hash mismatch`);
        res.status(401).end();
        return;
      }
    }
    LOGGER.info(`Validating signature for orderHashes: ${orderHashes}`);
    const cancelRequestSigner = verifyTypedData(
      EIP712_DOMAIN(chainId),
      CANCEL_REQUEST_EIP712_TYPE,
      { orderHashes },
      signature,
    );

    if (cancelRequestSigner.toUpperCase() != orderSigner?.toUpperCase()) {
      LOGGER.info(`Cancel signer: ${cancelRequestSigner} is not Order signer: ${orderSigner}`);
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
