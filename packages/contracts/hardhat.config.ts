import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig, NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { resolve } from "path";

import "./tasks/cancel-tx";
import "./tasks/accounts";
dotenvConfig({ path: resolve(__dirname, "./.env") });

const ethereumChainIds = {
  mainnet: 1,
  goerli: 5,
  ganache: 1337,
  hardhat: 31337,
  kovan: 42,
  rinkeby: 4,
  ropsten: 3,
};

enum Chains {
  ETHEREUM = "eth",
  ARBITRUM = "arb",
  POLYGON = "polygon",
}

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let rpcToken: string;
if (!process.env.RPC_TOKEN) {
  throw new Error("Please set your RPC_TOKEN in a .env file");
} else {
  rpcToken = process.env.RPC_TOKEN;
}

let etherscanApiKey: string;
if (!process.env.ETHERSCAN_API_KEY) {
  throw new Error("Please set your ETHERSCAN_API_KEY in a .env file");
} else {
  etherscanApiKey = process.env.ETHERSCAN_API_KEY;
}

function createETHConfig(network: keyof typeof ethereumChainIds): NetworkUserConfig {
  const url = `https://eth-${network}.g.alchemy.com/v2/${rpcToken}`;
  return createConfigWithUrl(url, ethereumChainIds[network]);
}

function createConfigWithUrl(url: string, chainId: number): NetworkUserConfig {
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    chainId,
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      chainId: 1,
    },
    fork: {
      accounts: {
        mnemonic,
      },
      forking: { url: `https://eth-mainnet.gateway.pokt.network/v1/lb/${rpcToken}`, blockNumber: 13176923 },
      chainId: 1,
      url: "http://localhost:8545",
    },
    goerli: createETHConfig("goerli"),
    mainnet: createETHConfig("mainnet"),
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./src",
    tests: "./test",
  },
  solidity: {
    version: "0.8.17",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    signer: { default: 0 },
  },
  mocha: {
    timeout: 30000,
  },
};

export default config;
