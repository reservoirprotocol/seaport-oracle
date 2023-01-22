import { CONTRACT_ADDRESSES } from "../utils/contracts";

export const EIP712_DOMAIN = (chainId: number) => ({
  name: "Breakwater",
  version: "1.0.0",
  chainId,
  verifyingContract: CONTRACT_ADDRESSES[chainId].breakwaterZone,
});

export const CANCEL_REQUEST_EIP712_TYPE = {
  OrderHashes: [{ name: "orderHashes", type: "bytes32[]" }],
};

export const SIGNED_ORDER_EIP712_TYPE = {
  SignedOrder: [
    { name: "fulfiller", type: "address" },
    { name: "expiration", type: "uint64" },
    { name: "orderHash", type: "bytes32" },
    { name: "context", type: "bytes" },
  ],
};

export const CONSIDERATION_EIP712_TYPE = {
  Consideration: [{ name: "consideration", type: "ReceivedItem[]" }],
  ReceivedItem: [
    { name: "itemType", type: "uint8" },
    { name: "token", type: "address" },
    { name: "identifier", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "recipient", type: "address" },
  ],
};
