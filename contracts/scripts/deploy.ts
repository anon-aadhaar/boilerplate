// @ts-ignore
import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

require("dotenv").config({ path: "../../.env.local" });

async function main() {
  const vote = await ethers.deployContract("AnonAadhaarVote", [
    "Do you like this app?",
    ["0", "1", "2", "3", "4", "5"],
    "0x" + process.env.NEXT_PUBLIC_ANON_AADHAAR_CONTRACT_ADDRESS,
  ]);

  await vote.waitForDeployment();

  console.log(`Vote contract deployed to ${await vote.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
