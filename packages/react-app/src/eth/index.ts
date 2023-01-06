import { ethers, Wallet } from "ethers";

const provider = ethers.getDefaultProvider(process.env.RPC_URL);

export const latestBlock = async () => await provider.getBlockNumber();

export const chainId = parseFloat(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");

export const wallet = new Wallet(process.env.SIGNER!).connect(provider);
