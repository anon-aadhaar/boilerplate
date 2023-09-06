import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const vote = await ethers.deployContract("Vote");

  await vote.waitForDeployment();

  console.log(`Vote contract deployed to ${await vote.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
