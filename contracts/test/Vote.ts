import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { genData, exportCallDataGroth16 } from "./utils";
import {
  IdentityPCDArgs,
  init,
  prove,
  PCDInitArgs,
  splitToWords,
} from "anon-aadhaar-pcd";

describe("Vote", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
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

    const pcdInitArgs: PCDInitArgs = {
      wasmURL: "https://d3dxq5smiosdl4.cloudfront.net/main.wasm",
      zkeyURL: "https://d3dxq5smiosdl4.cloudfront.net/circuit_final.zkey",
      isWebEnv: true,
    };

    await init(pcdInitArgs);

    const testData: [bigint, bigint, bigint, bigint] = await genData(
      "Hello world",
      "SHA-1"
    );

    const pcdArgs: IdentityPCDArgs = {
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

    const pcd = await prove(pcdArgs);

    const { a, b, c, Input } = await exportCallDataGroth16(
      pcd.proof.proof,
      pcd.proof.modulus
    );

    return { vote, a, b, c, Input };
  }

  describe("Deployment", function () {
    it("Should receive and store the propositions to vote", async function () {
      const { vote } = await loadFixture(deployOneYearLockFixture);

      expect(await vote.getProposalCount()).to.equal(3);
    });
  });

  describe("Vote", function () {
    describe("vote for 2", function () {
      it("Should Verify a valid proof.", async function () {
        const { vote, a, b, c, Input } = await loadFixture(
          deployOneYearLockFixture
        );

        console.log("Contract response: ", await vote.verify(a, b, c, Input));

        expect(await vote.verify(a, b, c, Input)).to.equal(true);
      });
    });

    describe("Events", function () {
      it("Should emit an event on vote.", async function () {
        const { vote, a, b, c, Input } = await loadFixture(
          deployOneYearLockFixture
        );

        await expect(vote.voteForProposal(1, a, b, c, Input)).to.emit(
          vote,
          "Voted"
        );
      });
    });
  });
});
