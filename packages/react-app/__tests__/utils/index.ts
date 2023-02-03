import { BytesLike } from "ethers";
import { arrayify, hexlify } from "ethers/lib/utils";

export function decodeExtraData(extraData: BytesLike) {
  const arrayfied = arrayify(extraData);
  const version = arrayfied.subarray(0, 1);
  const fulfiller = hexlify(arrayfied.subarray(1, 21));
  const expiration = hexlify(arrayfied.subarray(21, 29));
  const signature = hexlify(arrayfied.subarray(29, 93));
  const context = hexlify(arrayfied.subarray(93, arrayfied.length));
  return [version, fulfiller, expiration, signature, context];
}
