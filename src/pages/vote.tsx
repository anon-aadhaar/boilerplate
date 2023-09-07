/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar } from "anon-aadhaar-react";
import { IdentityPCD, SnarkJSProof } from "anon-aadhaar-pcd";
import { useEffect, useState } from "react";
import { Ratings } from "@/components/Ratings";
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/router";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useAccount, useContractWrite } from "wagmi";
import voteABI from "../../contracts/artifacts/contracts/Vote.sol/Vote.json";
import { exportCallDataGroth16 } from "../../contracts/test/utils";
import { BigNumberish } from "ethers";

export default function Vote() {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [pcd, setPcd] = useState<IdentityPCD>();
  const router = useRouter();
  const { isConnected } = useAccount();
  const [rating, setRating] = useState<string>();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0xC756ab7d1CfDb277f5026b917d21c2Ce9f79D5b7",
    abi: voteABI.abi,
    functionName: "voteForProposal",
  });

  const sendVote = async (
    rating: string,
    _pcdProof: SnarkJSProof,
    _pcdMod: BigNumberish
  ) => {
    const { a, b, c, Input } = await exportCallDataGroth16(_pcdProof, _pcdMod);
    write({
      args: [rating, a, b, c, Input],
    });
  };

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") setPcd(anonAadhaar.pcd);
  }, [anonAadhaar, data]);

  return (
    <>
      <main className="flex flex-col min-h-[70vh] mx-auto rounded-2xl max-w-screen-sm p-8 justify-between">
        <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
        <p>Now you can vote with your Anon Aadhaar proof.</p>

        <div className="flex w-full place-content-center gap-8">
          <Web3Button />
          {isConnected && <Web3NetworkSwitch />}
        </div>

        <div className="flex flex-col items-center gap-5">
          <p className="font-medium">
            On a scale of 0 to 5, how likely are you to recommend this hack?
          </p>
          <Ratings setRating={setRating} />

          <button
            disabled={rating === undefined || pcd === undefined}
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => {
              if (rating !== undefined && pcd !== undefined)
                sendVote(rating, pcd.proof.proof, pcd.proof.modulus);
            }}
          >
            Vote
          </button>
        </div>

        <Stepper
          step={3}
          onPrevClick={() => {
            router.push("/connect-wallet");
          }}
        />
      </main>
      <Footer text={"First, generate an Anon Aadhaar proof"} />
    </>
  );
}
