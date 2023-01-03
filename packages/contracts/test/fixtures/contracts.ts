import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Signer, Wallet } from "ethers";
import { deployments, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { CancelX, CancelX__factory, ICancelX, ICancelX__factory } from "../../typechain";
import { setupUser, setupUsers } from "./users";

export interface Contracts {
  CancelX: CancelX;
}

export interface User extends Contracts {
  address: string;
  signer: SignerWithAddress;
}

export const setupContracts = deployments.createFixture(async ({ ethers }) => {
  const { deployer } = await getNamedAccounts();
  await deployments.fixture(["Deployment"]);
  const cancelX = await deployments.get("CancelX");
  const signer = (await ethers.getSigners())[0];
  const cancelXContract = await CancelX__factory.connect(cancelX.address, signer);

  const contracts: Contracts = {
    CancelX: cancelXContract,
  };

  const users: User[] = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    contracts,
    deployer: <User>await setupUser(deployer, contracts),
    users,
  };
});
