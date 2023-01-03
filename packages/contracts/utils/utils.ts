import { BigNumber, BigNumberish, utils } from "ethers";

export function bigN(e: BigNumberish): BigNumber {
  return BigNumber.from(e);
}

export function _1E18(val: string | number): BigNumber {
  return utils.parseEther(val.toString()) as BigNumber;
}

export function ETH(val: string | number): BigNumber {
  return utils.parseEther(val.toString()) as BigNumber;
}

export function GWEI(val: string | number): BigNumber {
  return utils.parseUnits(val.toString(), "gwei") as BigNumber;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
