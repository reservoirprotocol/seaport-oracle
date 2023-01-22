import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Signer, Wallet } from "ethers";
import { deployments, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { Breakwater, Breakwater__factory, IBreakwater, IBreakwater__factory } from "../../typechain";
import { setupUser, setupUsers } from "./users";

export interface Contracts {
  Breakwater: Breakwater;
}

export interface User extends Contracts {
  address: string;
  signer: SignerWithAddress;
}

export const setupContracts = deployments.createFixture(async ({ ethers }) => {
  const { deployer } = await getNamedAccounts();
  await deployments.fixture(["Deployment"]);
  const Breakwater = await deployments.get("Breakwater");
  const signer = (await ethers.getSigners())[0];
  const BreakwaterContract = await Breakwater__factory.connect(Breakwater.address, signer);

  const contracts: Contracts = {
    Breakwater: BreakwaterContract,
  };

  const users: User[] = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    contracts,
    deployer: <User>await setupUser(deployer, contracts),
    users,
  };
});
