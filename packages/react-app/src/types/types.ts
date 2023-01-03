import { CONTRACT_ADDRESSES } from "../utils/contracts";

export type SignedOrder = {
  orderHash: string;
  extraData: string;
  blockDeadline: number;
  blockNumber: number;
};

export type OrderCancellation = {
  orderHash: string;
  owner: string;
  timestamp: number;
};

export const EIP712_DOMAIN = (chainId: number) => ({
  name: "CancelX",
  version: "1.0.0",
  chainId,
  verifyingContract: CONTRACT_ADDRESSES[chainId].cancelXZone,
});

export const CANCEL_REQUEST_EIP712_TYPE = {
  OrderHashes: [{ name: "orderHashes", type: "bytes32[]" }],
};

export const ORDER_VALIDITY_EIP712_TYPE = {
  OrderValidity: [
    { name: "blockDeadline", type: "uint256" },
    { name: "orderHash", type: "bytes32" },
  ],
};
