import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ArgumentTypeName } from "@pcd/pcd-types";
import {
  AnonAadhaarPCDArgs,
  init,
  prove,
  PCDInitArgs,
  WASM_URL,
  VK_URL,
  ZKEY_URL,
  genData,
  exportCallDataGroth16,
  AnonAadhaarPCD,
} from "anon-aadhaar-pcd";

describe("Test Vote.sol", function () {
  this.timeout(0);

  let testData: [bigint, bigint, bigint, bigint];

  let pcd: AnonAadhaarPCD;

  this.beforeAll(async () => {
    testData = await genData("Hello world", "SHA-1");

    const pcdInitArgs: PCDInitArgs = {
      wasmURL: WASM_URL,
      zkeyURL: ZKEY_URL,
      vkeyURL: VK_URL,
      isWebEnv: true,
    };

    await init(pcdInitArgs);

    const pcdArgs: AnonAadhaarPCDArgs = {
      signature: {
        argumentType: ArgumentTypeName.BigInt,
        value: testData[1] + "",
      },
      modulus: {
        argumentType: ArgumentTypeName.BigInt,
        value: testData[2] + "",
      },
      base_message: {
        argumentType: ArgumentTypeName.BigInt,
        value: testData[3] + "",
      },
    };

    pcd = await prove(pcdArgs);
  });

  async function deployOneYearLockFixture() {
    let Verifier = await ethers.getContractFactory("Verifier");
    let verifier = await Verifier.deploy();

    await verifier.waitForDeployment();
    const _verifierAddress = verifier.getAddress();

    let Vote = await ethers.getContractFactory("Vote");
    let vote = await Vote.deploy(
      "Do you like this app?",
      ["yes", "no", "maybe"],
      _verifierAddress
    );

    return { vote };
  }

  it("Should receive and store the propositions to vote", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    expect(await vote.getProposalCount()).to.equal(3);
  });

  it("Should Verify a valid proof.", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    const { a, b, c, Input } = await exportCallDataGroth16(
      pcd.proof.proof,
      pcd.proof.modulus
    );

    expect(await vote.verify(a, b, c, Input)).to.equal(true);
  });

  it("Should emit an event on vote.", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    const { a, b, c, Input } = await exportCallDataGroth16(
      pcd.proof.proof,
      pcd.proof.modulus
    );

    await expect(vote.voteForProposal(1, a, b, c, Input)).to.emit(
      vote,
      "Voted"
    );
  });

  it("Should return the right number of votes.", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    const { a, b, c, Input } = await exportCallDataGroth16(
      pcd.proof.proof,
      pcd.proof.modulus
    );

    await vote.voteForProposal(1, a, b, c, Input);

    expect(await vote.getTotalVotes()).to.equal(1);
  });
});
