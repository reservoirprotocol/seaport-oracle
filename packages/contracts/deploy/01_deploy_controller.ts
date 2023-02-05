import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("SignedZoneController", {
    from: deployer,
    log: true,
    args: [],
  });
  return true;
};
export default func;

func.id = "ControllerDeployment";
func.tags = ["Deployment"];
