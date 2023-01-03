import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer, signer } = await getNamedAccounts();

  await deploy("CancelX", {
    from: deployer,
    log: true,
    args: ["CancelX", "1.0.0", signer],
  });
  return true;
};
export default func;

func.id = "CancelXDeployment";
func.tags = ["Deployment"];
