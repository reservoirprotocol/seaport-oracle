import * as Sdk from "@reservoir0x/sdk";
import { z } from "zod";
import { chainId } from "../eth";
import { SEAPORT_ORDER_SCHEMA } from "../validation/schemas";

export enum HashingError {
  NONE,
  WRONG_ORDER_SIGNATURE,
  SIGNER_MISMATCH,
}

export type SeaPortOrder = z.infer<typeof SEAPORT_ORDER_SCHEMA>;

export async function hashOrders(orders: SeaPortOrder[]): Promise<[string[], string, HashingError]> {
  let orderSigner: string = "";
  const orderHashes = [];
  for (let i = 0; i < orders.length; i++) {
    const orderData = orders[i];
    const order = new Sdk.Seaport.Order(chainId, orderData);
    try {
      await order.checkSignature();
    } catch (e) {
      return [[], "", HashingError.WRONG_ORDER_SIGNATURE];
    }

    if (!orderSigner) {
      orderSigner = order.params.offerer;
    } else if (order.params.offerer != orderSigner) {
      return [[], "", HashingError.SIGNER_MISMATCH];
    }
    orderHashes.push(order.hash());
  }
  return [orderHashes, orderSigner!, HashingError.NONE];
}
