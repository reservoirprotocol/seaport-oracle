import { BigNumber, BigNumberish, BytesLike } from "ethers";
import { ethers } from "hardhat";

export const A_NON_ZERO_ADDRESS = "0x1234000000000000000000000000000000000000";
export const SECONDS_IN_A_DAY = 24 * 60 * 60;

export async function balance(address: string): Promise<BigNumber> {
  return await ethers.provider.getBalance(address);
}

export async function getCurrentTimeStamp(): Promise<number> {
  const blockNumber = await ethers.provider.getBlockNumber();
  return (await ethers.provider.getBlock(blockNumber)).timestamp;
}

export async function getCurrentBlockNumber(): Promise<number> {
  return await ethers.provider.getBlockNumber();
}

export async function advanceBlockAtTime(time: number): Promise<void> {
  await ethers.provider.send("evm_mine", [time]);
}

export async function advanceBlockBySeconds(secondsToAdd: number): Promise<void> {
  const newTimestamp = (await getCurrentTimeStamp()) + secondsToAdd;
  await ethers.provider.send("evm_mine", [newTimestamp]);
}

export async function advanceTimeByDays(daysToAdd: number): Promise<void> {
  const secondsToAdd = daysToAdd * SECONDS_IN_A_DAY;
  await ethers.provider.send("evm_increaseTime", [secondsToAdd]);
  mine();
}

export async function mineBlocks(blocksToMineInHex: string = "0x100"): Promise<void> {
  await ethers.provider.send("hardhat_mine", [blocksToMineInHex]);
}

export async function mine(): Promise<void> {
  await ethers.provider.send("evm_mine", []);
}

export async function manualMining(): Promise<void> {
  await ethers.provider.send("evm_setAutomine", [false]);
  await ethers.provider.send("evm_setIntervalMining", [0]);
}
export async function autoMining(): Promise<void> {
  await ethers.provider.send("evm_setAutomine", [true]);
}

//Quick hack to remove array subobject from ethers results
export function cleanResult(result: { [key: string]: any }): any {
  const clean = {} as {
    [key: string]: any;
  };
  Object.keys(result)
    .filter(key => isNaN(parseFloat(key)))
    .reduce((obj, key) => {
      clean[key] = result[key];
      return obj;
    }, {});
  return clean;
}

export const EIP712_DOMAIN = (chainId: number, contract: string) => ({
  name: "CancelX",
  version: "1.0.0",
  chainId,
  verifyingContract: contract,
});

export const ORDER_VALIDITY_EIP712_TYPE = {
  OrderValidity: [
    { name: "blockDeadline", type: "uint256" },
    { name: "orderHash", type: "bytes32" },
  ],
};
