import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {
  WASM_URL,
  ZKEY_URL,
  init,
  prove,
  extractWitness,
  exportCallDataGroth16,
  exportCallDataGroth16FromPCD,
  VK_URL,
  AnonAadhaarPCDArgs,
  splitToWords,
} from "anon-aadhaar-pcd";
import { fetchKey } from "./utils";
import fs from "fs";
import { ArgumentTypeName } from "@pcd/pcd-types";
import { ZKArtifact } from "snarkjs";
import { describe } from "mocha";

describe("Test Vote.sol", function () {
  this.timeout(0);

  let witnessInputs: {
    signature: string[];
    modulus: string[];
    base_message: string[];
    app_id: string;
  };
  let appIdBigInt: string;
  let pcdInputs: any;
  let wasm_key: ZKArtifact; 
  let zkey: ZKArtifact;

  this.beforeAll(async () => {
    const testFile = __dirname + "/signed.pdf";
    const pdfRaw = fs.readFileSync(testFile);
    const pdfBuffer = Buffer.from(pdfRaw);
    const extractedData = await extractWitness(pdfBuffer, "test123");

    if (extractedData instanceof Error) throw new Error(extractedData.message);

    appIdBigInt = "196700487049306364386084600156231018794323017728";

    witnessInputs = {
      signature: splitToWords(extractedData.sigBigInt, BigInt(64), BigInt(32)),
      modulus: splitToWords(
        extractedData.modulusBigInt,
        BigInt(64),
        BigInt(32)
      ),
      base_message: splitToWords(
        extractedData.msgBigInt,
        BigInt(64),
        BigInt(32)
      ),
      app_id: appIdBigInt,
    };

    pcdInputs = {
      signature: extractedData.sigBigInt,
      modulus: extractedData.modulusBigInt,
      base_message: extractedData.msgBigInt,
      app_id: appIdBigInt,
    };
    wasm_key = await fetchKey(WASM_URL);
    zkey = await fetchKey(ZKEY_URL);
  });

  async function deployOneYearLockFixture() {
    let Verifier = await ethers.getContractFactory("Verifier");
    let verifier = await Verifier.deploy();

    await verifier.waitForDeployment();
    const _verifierAddress = verifier.getAddress();

    const AnonAadhaarVerifier = await ethers.getContractFactory(
      "AnonAadhaarVerifier"
    );
    const anonAadhaarVerifier = await AnonAadhaarVerifier.deploy(
      _verifierAddress,
      appIdBigInt
    );

    await anonAadhaarVerifier.waitForDeployment();
    const _AnonAadhaarVerifierAddress = anonAadhaarVerifier.getAddress();

    let Vote = await ethers.getContractFactory("Vote");
    let vote = await Vote.deploy(
      "Do you like this app?",
      ["yes", "no", "maybe"],
      _AnonAadhaarVerifierAddress
    );

    return { vote, appIdBigInt };
  }

  it("Should receive and store the propositions to vote", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    expect(await vote.getProposalCount()).to.equal(3);
  });

  describe("Verify with valid proof", () => {
    let a:any, b: any, c: any, Input: any;
    this.beforeAll(async () => {
      let proof = await exportCallDataGroth16(witnessInputs, wasm_key, zkey);
      a = proof.a; 
      b = proof.b;
      c = proof.c;
      Input = proof.Input;
    }) 

    it("Should Verify a valid proof.", async function () {
      const { vote } = await loadFixture(deployOneYearLockFixture);
      expect(await vote.verify(a, b, c, Input)).to.equal(true);
    });
   
    it("Should return the right number of votes.", async function () {
      const { vote } = await loadFixture(deployOneYearLockFixture);

      await vote.voteForProposal(1, a, b, c, Input);
  
      expect(await vote.getTotalVotes()).to.equal(1);
    });
  
    it("Should emit vote event for a vote with a valid proof", async function () {
      const { vote } = await loadFixture(deployOneYearLockFixture);

      await expect(vote.voteForProposal(1, a, b, c, Input)).to.emit(
        vote,
        "Voted"
      );
    });
  })
  

  it("Should Verify a valid PCD.", async function () {
    const { vote } = await loadFixture(deployOneYearLockFixture);

    await init({
      wasmURL: WASM_URL,
      zkeyURL: ZKEY_URL,
      vkeyURL: VK_URL,
      isWebEnv: true,
    });

    const pcdArgs: AnonAadhaarPCDArgs = {
      signature: {
        argumentType: ArgumentTypeName.BigInt,
        value: pcdInputs.signature,
      },
      modulus: {
        argumentType: ArgumentTypeName.BigInt,
        value: pcdInputs.modulus,
      },
      base_message: {
        argumentType: ArgumentTypeName.BigInt,
        value: pcdInputs.base_message,
      },
      app_id: {
        argumentType: ArgumentTypeName.BigInt,
        value: pcdInputs.app_id,
      },
    };

    const pcd = await prove(pcdArgs);

    const { a, b, c, Input } = await exportCallDataGroth16FromPCD(pcd);

    expect(await vote.verify(a, b, c, Input)).to.equal(true);
  });
});
