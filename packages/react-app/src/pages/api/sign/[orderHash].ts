import { defaultAbiCoder } from "ethers/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { chainId, provider, wallet } from "../../../eth";
import { isCancelled } from "../../../persistence/mongodb";
import { EIP712_DOMAIN, ORDER_VALIDITY_EIP712_TYPE, SignedOrder } from "../../../types/types";
import { MAX_BLOCKS_VALITIDY } from "../../../utils/constants";
import { createLogger } from "../../../utils/logger";

const LOGGER = createLogger("sign");

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignedOrder | null>) {
  try {
    const { orderHash } = req.query;
    if (!orderHash) {
      res.status(400).end();
      return;
    }
    const blockNumber = await provider.getBlockNumber();
    if (await isCancelled(orderHash.toString())) {
      res.status(409).end();
      return;
    }
    LOGGER.info(`Signed order hash: ${orderHash} at block: ${blockNumber}`);
    const blockDeadline = blockNumber + MAX_BLOCKS_VALITIDY;
    const signature = await wallet._signTypedData(EIP712_DOMAIN(chainId), ORDER_VALIDITY_EIP712_TYPE, {
      blockDeadline,
      orderHash,
    });

    const extraData = defaultAbiCoder.encode(
      ["tuple(uint256, bytes32)", "bytes"],
      [[blockDeadline, orderHash], signature],
    );

    res.status(200).json({ extraData, orderHash: orderHash.toString(), blockDeadline, blockNumber });
  } catch (e) {
    LOGGER.error(e);
    res.status(500).end();
  }
}
