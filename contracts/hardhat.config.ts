import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";
require("dotenv").config({ path: "../.env.local" });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  dependencyCompiler: {
    paths: ["@anon-aadhaar/contracts"],
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_SEPOLIA_PROVIDER_ID}`,
      accounts: [process.env.PRIVATE_KEY || ""],
    },
  },
};

export default config;
