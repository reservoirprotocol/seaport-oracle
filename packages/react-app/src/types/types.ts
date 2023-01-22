import { OrderComponents } from "@reservoir0x/sdk/dist/seaport/types";

export type SignedOrder = {
  orderHash: string;
  extraData: string;
  expiration: number;
};

export type ExtraData = {
  extraData: string;
};

export type ApiError = { orderHash: string; error: string; message: string };

export type SignedOrders = {
  orders: ExtraData[];
  errors?: ApiError[];
};

export type OrderCancellation = {
  orderHash: string;
  owner: string;
  timestamp: number;
};
