import { ItemType, OrderType } from "@reservoir0x/sdk/dist/seaport-base/types";
import { EnumLike, z } from "zod";
const ethAddressRE = /(^0x[A-Fa-f0-9]{40}$)/g;
const uint256HexRE = /(^0x[A-Fa-f0-9]{1,64}$)/g;
const uint256DecimalRE = /(^[0-9]{1,78}$)/g;
const bytes32RE = /(^0x[A-Fa-f0-9]{64}$)/g;
const ethAddress = z.string().regex(ethAddressRE);
const uint256 = z.string().regex(uint256HexRE).or(z.string().regex(uint256DecimalRE));
const bytes32 = z.string().regex(bytes32RE);
const solidityEnum = (e: EnumLike) => z.number().max(Object.keys(e).length - 1);

export const SEAPORT_ORDER_SCHEMA = z.object({
  kind: z.enum(["contract-wide", "single-token", "token-list"]),
  offerer: ethAddress,
  zone: ethAddress,
  offer: z.array(
    z.object({
      itemType: solidityEnum(ItemType),
      token: ethAddress,
      identifierOrCriteria: uint256,
      startAmount: uint256,
      endAmount: uint256,
    }),
  ),
  consideration: z.array(
    z.object({
      itemType: solidityEnum(ItemType),
      token: ethAddress,
      identifierOrCriteria: uint256,
      startAmount: uint256,
      endAmount: uint256,
      recipient: ethAddress,
    }),
  ),
  orderType: solidityEnum(OrderType),
  startTime: z.number(),
  endTime: z.number(),
  zoneHash: bytes32,
  salt: uint256,
  conduitKey: bytes32,
  counter: uint256,
  signature: z.string(),
});

export const RECEIVED_ITEM = z.object({
  itemType: solidityEnum(ItemType),
  token: ethAddress,
  identifier: uint256,
  amount: uint256,
  recipient: ethAddress,
});

export const ORDER_CANCELLATION_REQUEST = z.object({
  signature: z.string(),
  orders: z.array(SEAPORT_ORDER_SCHEMA).nonempty(),
  orderKind: z.enum(["seaport-v1.4", "seaport-v1.5", "alienswap"]).default("seaport-v1.4"),
});

export const ORDER_REPLACEMENT_REQUEST = z.object({
  replacedOrders: z.array(SEAPORT_ORDER_SCHEMA).nonempty(),
  newOrders: z.array(SEAPORT_ORDER_SCHEMA).nonempty(),
  orderKind: z.enum(["seaport-v1.4", "seaport-v1.5", "alienswap"]).default("seaport-v1.4"),
});

export const SUBSTANDARD_3_REQUEST = z.object({
  requestedReceivedItems: z.array(RECEIVED_ITEM),
});

export const ORDER_SIGNATURE_REQUEST_ITEM = z.object({
  chainId: z.string().or(z.number()),
  fulfiller: ethAddress,
  marketplaceContract: ethAddress,
  orderParameters: SEAPORT_ORDER_SCHEMA,
  substandardRequests: z.array(SUBSTANDARD_3_REQUEST).length(1),
});

export const ORDER_SIGNATURE_REQUEST = z.object({
  orders: z.array(ORDER_SIGNATURE_REQUEST_ITEM).nonempty(),
});
