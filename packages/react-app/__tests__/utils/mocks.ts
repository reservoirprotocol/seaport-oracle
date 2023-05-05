import { generateMock } from "@anatine/zod-mock";
import { ConsiderationItem, OrderComponents, ReceivedItem } from "@reservoir0x/sdk/dist/seaport-base/types";
import { BigNumber, constants, utils, Wallet } from "ethers";
import { chainId } from "../../src/eth";
import { ORDER_SIGNATURE_REQUEST_ITEM, RECEIVED_ITEM, SEAPORT_ORDER_SCHEMA } from "../../src/validation/schemas";
import * as Sdk from "@reservoir0x/sdk";
import { z } from "zod";

export function toReceivedItems(items: ConsiderationItem[]): ReceivedItem[] {
  return items.map(item => ({
    ...item,
    amount: item.startAmount,
    identifier: item.identifierOrCriteria,
  }));
}

export async function mockOrders(user: Wallet, numberOfOrders: number): Promise<[OrderComponents[], string[]]> {
  const orders: OrderComponents[] = [];
  const orderHashes: string[] = [];

  for (let i = 0; i < numberOfOrders; i++) {
    const orderData = generateMock(SEAPORT_ORDER_SCHEMA);
    orderData.offerer = user.address;
    const order = new Sdk.SeaportV14.Order(chainId, orderData);
    await order.sign(user);
    const orderHash = await order.hash();
    orderHashes.push(orderHash);
    orders.push(order.params);
  }

  return [orders, orderHashes];
}

export async function mockOrderSignatureRequest(
  numberOfOrders: number,
  flaggedCheck: boolean = false,
): Promise<[z.infer<typeof ORDER_SIGNATURE_REQUEST_ITEM>[], string[]]> {
  const orders = [];
  const orderHashes = [];
  const validAddress = Wallet.createRandom().address;
  for (let i = 0; i < numberOfOrders; i++) {
    const order = generateMock(ORDER_SIGNATURE_REQUEST_ITEM);
    order.fulfiller = validAddress;
    order.orderParameters.zoneHash = flaggedCheck
      ? "0x8000000000000000000000000000000000000000000000000000000000000000"
      : constants.HashZero;
    order.substandardRequests[0].requestedReceivedItems = order.substandardRequests[0].requestedReceivedItems?.map(
      c => ({
        ...c,
        token: validAddress,
        recipient: validAddress,
      }),
    );
    orders.push(order);
    orderHashes.push(new Sdk.SeaportV14.Order(chainId, order.orderParameters).hash());
  }

  return [orders, orderHashes];
}

export async function mockReplacementOrders(user: Wallet, salts: string[]): Promise<OrderComponents[]> {
  const orders: OrderComponents[] = [];

  for (let i = 0; i < salts.length; i++) {
    const orderData = generateMock(SEAPORT_ORDER_SCHEMA);
    orderData.offerer = user.address;
    if (salts[i]) {
      orderData.salt = salts[i];
    }
    const order = new Sdk.SeaportV14.Order(chainId, orderData);
    await order.sign(user);
    orders.push(order.params);
  }

  return orders;
}
