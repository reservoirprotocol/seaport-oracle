export type SignedOrder = {
  orderHash: string;
  extraData?: string;
  expiration?: number;
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
