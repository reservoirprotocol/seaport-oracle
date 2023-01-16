import * as Sdk from "@reservoir0x/sdk";
import { BigNumber } from "ethers";
import { z } from "zod";
import { chainId } from "../eth";
import { SEAPORT_ORDER_SCHEMA } from "../validation/schemas";

export enum ValidationError {
  NONE,
  WRONG_ORDER_SIGNATURE,
  SIGNER_MISMATCH,
  SALT_MISSING,
}

export type SeaPortOrder = z.infer<typeof SEAPORT_ORDER_SCHEMA>;

export async function hashOrders(orders: SeaPortOrder[]): Promise<[string[], string, ValidationError]> {
  let orderSigner: string = "";
  const orderHashes = [];
  for (let i = 0; i < orders.length; i++) {
    const orderData = orders[i];
    const order = new Sdk.Seaport.Order(chainId, orderData);
    try {
      await order.checkSignature();
    } catch (e) {
      return [[], "", ValidationError.WRONG_ORDER_SIGNATURE];
    }

    if (!orderSigner) {
      orderSigner = order.params.offerer;
    } else if (order.params.offerer != orderSigner) {
      return [[], "", ValidationError.SIGNER_MISMATCH];
    }
    orderHashes.push(order.hash());
  }
  return [orderHashes, orderSigner!, ValidationError.NONE];
}

export async function getReplacedOrderHashes(
  replacedOrdersByHash: Map<string, SeaPortOrder>,
  newOrders: SeaPortOrder[],
): Promise<[string[], string, ValidationError]> {
  let orderSigner: string = "";
  const salts = [];

  for (let i = 0; i < newOrders.length; i++) {
    const orderData = newOrders[i];
    const order = new Sdk.Seaport.Order(chainId, orderData);

    try {
      await order.checkSignature();
    } catch (e) {
      return [[], "", ValidationError.WRONG_ORDER_SIGNATURE];
    }

    if (!orderSigner) {
      orderSigner = order.params.offerer;
    } else if (order.params.offerer != orderSigner) {
      return [[], "", ValidationError.SIGNER_MISMATCH];
    }

    if (BigNumber.from(order.params.salt).isZero()) {
      return [[], "", ValidationError.SALT_MISSING];
    }

    const replacedOrder = replacedOrdersByHash.get(order.params.salt);

    if (!replacedOrder || replacedOrder.offerer != orderSigner) {
      return [[], "", ValidationError.SIGNER_MISMATCH];
    }
    salts.push(order.params.salt);
  }
  return [salts, orderSigner!, ValidationError.NONE];
}
