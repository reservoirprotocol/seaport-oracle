import { ItemType, OrderType } from "@reservoir0x/sdk/dist/seaport/types";
import { EnumLike, z } from "zod";
const ethAddressRE = /(^0x[A-Fa-f0-9]{40}$)/g;
const uint256HexRE = /(^0x[A-Fa-f0-9]{1,64}$)/g;
const uint256DecimalRE = /(^[0-9]{1,76}$)/g;
const bytes32RE = /(^0x[A-Fa-f0-9]{64}$)/g;
const ethAddress = z.string().regex(ethAddressRE);
const uint256 = z.string().regex(uint256HexRE).or(z.string().regex(uint256DecimalRE));
const bytes32 = z.string().regex(bytes32RE);
const solidityEnum = (e: EnumLike) => z.number().max(Object.keys(e).length - 1);

export const SEAPORT_ORDER_SCHEMA = z.object({
  kind: z.enum(["contract-wide", "single-token", "token-list", "bundle-ask"]),
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

export const ORDER_CANCELLATION_REQUEST = z.object({
  signature: z.string(),
  orderHashes: z.array(bytes32).nonempty(),
});
