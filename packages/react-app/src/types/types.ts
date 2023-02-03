import { OrderComponents, ReceivedItem } from "@reservoir0x/sdk/dist/seaport/types";
import { BytesLike } from "ethers";

export type SignedOrder = {
  extraDataComponent?: BytesLike;
  orderParameters?: OrderComponents;
  substandardResponses?: [
    {
      requiredReceivedItems: ReceivedItem[];
      requiredReceivedItemsHash: BytesLike;
    },
  ];
  error?: string;
  message?: string;
};

export type ApiError = {
  error?: string;
  message?: string;
};

export type ExtraData = {
  extraData: string;
};

export type SignedOrders = {
  orders: SignedOrder[];
};

export type OrderCancellation = {
  orderHash: string;
  owner: string;
  timestamp: number;
};

export type OrderCancellations = {
  cancellations: OrderCancellation[];
};

export type SignatureInfo = {
  orderHash: string;
  expiration: number;
};
