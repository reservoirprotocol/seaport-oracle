import { OrderComponents, ReceivedItem } from "@reservoir0x/sdk/dist/seaport/types";
import { BigNumberish, BytesLike, Wallet } from "ethers";
import { verifyTypedData, _TypedDataEncoder } from "ethers/lib/utils";
import { chainId, wallet } from "../eth";
import {
  CANCEL_REQUEST_EIP712_TYPE,
  CONSIDERATION_EIP712_TYPE,
  EIP712_DOMAIN,
  SIGNED_ORDER_EIP712_TYPE,
} from "./types";

export async function signOrder(fulfiller: string, expiration: number, orderHash: string, context: BytesLike) {
  return await wallet._signTypedData(EIP712_DOMAIN(chainId), SIGNED_ORDER_EIP712_TYPE, {
    fulfiller,
    expiration,
    orderHash,
    context,
  });
}

export function hashConsideration(consideration: ReceivedItem[]): BytesLike {
  return _TypedDataEncoder.hashStruct("Consideration", CONSIDERATION_EIP712_TYPE, {
    consideration,
  });
}

export async function signCancelRequest(signer: Wallet, orderHashes: string[]) {
  return await signer._signTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, {
    orderHashes,
  });
}

export function recoverCancelRequestSigner(
  orderHashes: string[],
  data: {
    signature: string;
    orders: OrderComponents[];
  },
) {
  return verifyTypedData(EIP712_DOMAIN(chainId), CANCEL_REQUEST_EIP712_TYPE, { orderHashes }, data.signature);
}

export function recoverOrderSigner(
  fulfiller: string,
  expiration: BigNumberish,
  orderHash: string,
  context: BytesLike,
  signature: BytesLike,
) {
  return verifyTypedData(
    EIP712_DOMAIN(chainId),
    SIGNED_ORDER_EIP712_TYPE,
    {
      fulfiller,
      expiration,
      orderHash,
      context,
    },
    signature,
  );
}
