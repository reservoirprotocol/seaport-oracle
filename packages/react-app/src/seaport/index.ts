import * as Sdk from "@reservoir0x/sdk";
import { OrderComponents } from "@reservoir0x/sdk/dist/seaport/types";
import { BigNumber } from "ethers";
import { chainId } from "../eth";

export enum ValidationError {
  NONE,
  WRONG_ORDER_SIGNATURE,
  SIGNER_MISMATCH,
  SALT_MISSING,
}

export type HashingResult = {
  orderHashes?: string[];
  orderSigner?: string;
  error: ValidationError;
  erroredOrderHash?: string;
};

export async function hashOrders(orders: OrderComponents[]): Promise<HashingResult> {
  let orderSigner: string = "";
  const orderHashes = [];
  for (let i = 0; i < orders.length; i++) {
    const orderData = orders[i];
    const order = new Sdk.Seaport.Order(chainId, orderData);
    const orderHash = order.hash();
    try {
      await order.checkSignature();
    } catch (e) {
      return { error: ValidationError.WRONG_ORDER_SIGNATURE, erroredOrderHash: orderHash };
    }

    if (!orderSigner) {
      orderSigner = order.params.offerer;
    } else if (order.params.offerer != orderSigner) {
      return { error: ValidationError.SIGNER_MISMATCH, erroredOrderHash: orderHash };
    }
    orderHashes.push(orderHash);
  }

  return { orderHashes, orderSigner, error: ValidationError.NONE };
}

export async function getReplacedOrderHashes(
  replacedOrders: OrderComponents[],
  newOrders: OrderComponents[],
): Promise<HashingResult> {
  const result = await hashOrders(replacedOrders);
  const { orderHashes, orderSigner, error } = result;
  if (error != ValidationError.NONE) {
    return result;
  }

  const replacedOrdersByHash = new Map(orderHashes!.map((hash, i) => [hash, replacedOrders[i]]));
  const salts = [];

  for (let i = 0; i < newOrders.length; i++) {
    const orderData = newOrders[i];
    const order = new Sdk.Seaport.Order(chainId, orderData);
    try {
      await order.checkSignature();
    } catch (e) {
      return { error: ValidationError.WRONG_ORDER_SIGNATURE, erroredOrderHash: order.hash() };
    }

    if (order.params.offerer != orderSigner) {
      return { error: ValidationError.SIGNER_MISMATCH, erroredOrderHash: order.hash() };
    }

    if (BigNumber.from(order.params.salt).isZero()) {
      return { error: ValidationError.SALT_MISSING, erroredOrderHash: order.hash() };
    }

    const replacedOrder = replacedOrdersByHash.get(order.params.salt);

    if (!replacedOrder || replacedOrder.offerer != orderSigner) {
      return { error: ValidationError.SIGNER_MISMATCH, erroredOrderHash: order.hash() };
    }
    salts.push(order.params.salt);
  }
  return { orderHashes: salts, orderSigner, error: ValidationError.NONE };
}
