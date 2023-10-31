import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";

const secret = require('./.secret');

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: secret.alchemy.url,
      accounts: secret.privateKey,
    },
  },
  sourcify: {
    enabled: true,
  },
  etherscan: secret.etherscan,
};

export default config;
