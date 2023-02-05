import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ZONE_ID } from "../config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { execute } = deployments;

  const { deployer } = await getNamedAccounts();

  await execute(
    "SignedZoneController",
    {
      from: deployer,
      log: true,
    },
    "createZone",
    "Breakwater",
    "",
    "",
    deployer,
    ZONE_ID(deployer),
  );

  return true;
};

export default func;

func.id = "BreakwaterDeployment";
func.tags = ["Deployment"];
