import { solidityPack, toUtf8Bytes } from "ethers/lib/utils";

export const ZONE_ID = (deployer: string) =>
  padRightTo32Bytes(solidityPack(["address", "bytes"], [deployer, toUtf8Bytes("breakwater")]));

function padRightTo32Bytes(value: string) {
  if (value.length > 66) throw Error("Value too large");
  return value.padEnd(66, "0");
}
