import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Breakwater", {
    from: deployer,
    log: true,
    args: ["Breakwater", "1.0.0", ""], //TODO add proper api endpoint
  });
  return true;
};
export default func;

func.id = "BreakwaterDeployment";
func.tags = ["Deployment"];
