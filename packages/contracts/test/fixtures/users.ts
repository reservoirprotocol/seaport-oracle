import { Contract, Wallet } from "ethers";
import { ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";

//TODO fix typing
export async function setupUsers<U>(addresses: string[], contracts: unknown): Promise<U[]> {
  const users: U[] = [];
  for (const address of addresses) {
    users.push(await setupUser(address, contracts));
  }
  return users;
}

export async function setupUser<U>(address: string, unsafeContracts: unknown): Promise<U> {
  const signer = await ethers.getSigner(address);
  const user: any = { address, signer };
  const contracts = unsafeContracts as { [contractName: string]: Contract };

  for (const key of Object.keys(contracts)) {
    user[key] = contracts[key].connect(signer);
  }
  return user as U;
}

export async function setupUnnamedUsers<U>(unsafeContracts: unknown): Promise<U[]> {
  return await setupUsers(await getUnnamedAccounts(), unsafeContracts);
}

export async function setupDeployer<U>(unsafeContracts: unknown): Promise<U> {
  const { deployer } = await getNamedAccounts();
  return await setupUser(deployer, unsafeContracts);
}

export async function setupUsersWithMocks<U>(wallets: Wallet[], contracts: unknown): Promise<U[]> {
  const users: U[] = [];
  for (const wallet of wallets) {
    users.push(await setupUserWithMock(wallet, contracts));
  }
  return users;
}

export async function setupUserWithMock<U>(wallet: Wallet, unsafeContracts: unknown): Promise<U> {
  const user: any = { address: wallet.address, signer: wallet };
  const contracts = unsafeContracts as { [contractName: string]: Contract };

  for (const key of Object.keys(contracts)) {
    user[key] = contracts[key].connect(wallet);
  }
  return user as U;
}
