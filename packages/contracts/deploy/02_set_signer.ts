import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ZONE_ID } from "../config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { execute, read } = deployments;

  const { deployer, signer } = await getNamedAccounts();
  if (signer === deployer) throw new Error("Signer cannot be deployer");

  const zoneAddress = await read("SignedZoneController", "getZone", ZONE_ID(deployer));

  await execute(
    "SignedZoneController",
    {
      from: deployer,
      log: true,
    },
    "updateSigner",
    zoneAddress,
    signer,
    true,
  );
  return true;
};
export default func;

func.id = "SetSigner";
func.tags = ["Operations"];
