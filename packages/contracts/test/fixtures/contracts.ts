import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { ZONE_ID } from "../../config";
import { SignedZone, SignedZoneController, SignedZoneController__factory, SignedZone__factory } from "../../typechain";
import { setupUser, setupUsers } from "./users";

export interface Contracts {
  Controller: SignedZoneController;
  Breakwater: SignedZone;
}

export interface User extends Contracts {
  address: string;
  signer: SignerWithAddress;
}

export const setupContracts = deployments.createFixture(async ({ ethers }) => {
  const { deployer } = await getNamedAccounts();
  await deployments.fixture(["Deployment"]);
  const signedZoneController = await deployments.get("SignedZoneController");
  const signer = (await ethers.getSigners())[0];
  const signedZoneControllerContract = await SignedZoneController__factory.connect(
    signedZoneController.address,
    signer,
  );

  const zoneAddress = await signedZoneControllerContract.getZone(ZONE_ID(deployer));
  const breakwaterContract = await SignedZone__factory.connect(zoneAddress, signer);
  const contracts: Contracts = {
    Controller: signedZoneControllerContract,
    Breakwater: breakwaterContract,
  };

  const users: User[] = await setupUsers(await getUnnamedAccounts(), contracts);

  return {
    contracts,
    deployer: <User>await setupUser(deployer, contracts),
    users,
  };
});
