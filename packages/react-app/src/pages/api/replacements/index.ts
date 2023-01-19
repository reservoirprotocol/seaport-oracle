import { utils } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { insertCancellation } from "../../../persistence/mongodb";
import { getReplacedOrderHashes, hashOrders, ValidationError } from "../../../seaport";
import { createLogger } from "../../../utils/logger";
import { getTimestamp } from "../../../utils/time";
import { ORDER_REPLACEMENT_REQUEST } from "../../../validation/schemas";

const LOGGER = createLogger("replacements");

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    if (req.method != "POST") {
      res.status(501).end();
      return;
    }
    await handlePost();
  } catch (e) {
    LOGGER.error(e);
    res.status(500).end();
  }

  async function handlePost() {
    let data;
    try {
      data = ORDER_REPLACEMENT_REQUEST.parse(req.body);
    } catch (e) {
      LOGGER.error(e);
      res.status(400).end();
      return;
    }
    const { newOrders, replacedOrders } = data;

    if (newOrders.length !== replacedOrders.length) {
      LOGGER.error(`Number of orders do not match`);
      res.status(400).end();
      return;
    }

    const [hashes, , hashingError] = await hashOrders(replacedOrders);

    if (hashingError != ValidationError.NONE) {
      LOGGER.error(`Validation Error: ${hashingError}`);
      res.status(400).end();
      return;
    }

    const replacedOrdersByHash = new Map(hashes.map((hash, i) => [hash, replacedOrders[i]]));
    const [salts, orderSigner, error] = await getReplacedOrderHashes(replacedOrdersByHash, newOrders);

    if (error != ValidationError.NONE) {
      LOGGER.error(`Validation Error: ${error}`);
      res.status(400).end();
      return;
    }

    LOGGER.info(`orderHashes: ${JSON.stringify(salts)}`);
    LOGGER.info(`orderSigner: ${orderSigner}`);

    for (let i = 0; i < salts.length; i++) {
      const orderHash = salts[i];
      LOGGER.info(`Inserting: ${orderHash}`);
      await insertCancellation({ orderHash, owner: utils.getAddress(orderSigner), timestamp: getTimestamp() });
    }

    res.status(200).end();
  }
}
