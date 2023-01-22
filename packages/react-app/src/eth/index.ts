import { ethers, utils, Wallet } from "ethers";

const provider = ethers.getDefaultProvider(process.env.RPC_URL);

export const latestBlock = async () => await provider.getBlockNumber();

export async function latestTimestamp(): Promise<number> {
  return (await provider.getBlock("latest")).timestamp;
}

export const chainId = parseFloat(process.env.NEXT_PUBLIC_CHAIN_ID ?? "1");

export const wallet = new Wallet(process.env.SIGNER!).connect(provider);

export const convertSignatureToEIP2098 = (signature: string) => {
  if (signature.length === 130) {
    return signature;
  }

  if (signature.length !== 132) {
    throw Error("invalid signature length (must be 64 or 65 bytes)");
  }

  return utils.splitSignature(signature).compact;
};
