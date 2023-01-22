import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { execute } = deployments;

  const { deployer, signer } = await getNamedAccounts();
  if (signer === deployer) throw new Error("Signer cannot be deployer");

  await execute(
    "Breakwater",
    {
      from: deployer,
      log: true,
    },
    "addSigner",
    signer,
  );
  return true;
};
export default func;

func.id = "SetSigner";
func.tags = ["Operations"];
