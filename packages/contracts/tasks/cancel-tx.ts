import { task, types } from "hardhat/config";
import { GWEI } from "../utils/utils";
import { CANCEL_TX } from "./task-names";

task(CANCEL_TX, "Cancel tx")
  .addParam("nonce", "nonce", undefined, types.int, false)
  .setAction(async ({ nonce }, hre): Promise<void> => {
    const { ethers } = hre;
    const accounts = await ethers.provider.listAccounts();
    const account = accounts[1];
    console.log(`Cancelling tx with nonce ${nonce} for ${account}`);

    const signer = await ethers.provider.getSigner(account);
    const tx = await signer.sendTransaction({
      to: account,
      value: 0,
      nonce,
      gasPrice: GWEI(12),
    });
    await tx.wait();
    console.log("Done");
  });
