/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar } from "anon-aadhaar-react";
import {
  AnonAadhaarPCD,
  SnarkJSProof,
  exportCallDataGroth16,
  BigNumberish,
} from "anon-aadhaar-pcd";
import { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Ratings } from "@/components/Ratings";
import { Stepper } from "@/components/Stepper";
import { Loader } from "@/components/Loader";
import { VoteResults } from "@/components/VoteResults";
import { useRouter } from "next/router";
import { useAccount, useContractWrite } from "wagmi";
import voteABI from "../../public/Vote.json";
import dynamic from "next/dynamic";
import { UserStatus } from "@/interface";

const WalletMultiButton = dynamic(
  async () => (await import("@web3modal/react")).Web3Button,
  { ssr: false }
);

const WalletMultiSwitch = dynamic(
  async () => (await import("@web3modal/react")).Web3NetworkSwitch,
  { ssr: false }
);

type VoteProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
};

export default function Vote({ setUserStatus }: VoteProps) {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [pcd, setPcd] = useState<AnonAadhaarPCD>();
  const router = useRouter();
  const { isConnected } = useAccount();
  const [rating, setRating] = useState<string>();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""}`,
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
  }, [anonAadhaar]);

  useEffect(() => {
    if (isConnected) setUserStatus(UserStatus.WALLET_CONNECTED);
    else setUserStatus(UserStatus.WALLET_NOT_CONNECTED);
  }, [isConnected, setUserStatus]);

  return (
    <>
      <main className="flex flex-col min-h-[70vh] mx-auto rounded-2xl max-w-screen-sm w-full p-8 justify-between">
        <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
        <p>
          Secondly, you can now connect your wallet and vote with your Anon
          Aadhaar proof. Your vote will be spend along side your proof, and the
          smart contract will first check your proof and then compute your vote.
        </p>

        <div className="flex w-full place-content-center gap-8">
          <WalletMultiButton />
          {isConnected && <WalletMultiSwitch />}
        </div>

        <VoteResults />

        <div className="flex flex-col items-center gap-5">
          <p className="font-medium">
            On a scale of 0 to 5, how likely are you to recommend this hack?
          </p>
          <Ratings setRating={setRating} />
          {isConnected ? (
            isSuccess ? (
              <>
                <button
                  disabled={true}
                  type="button"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                >
                  Vote sent ✅
                </button>
                <p className="font-bold">
                  You can check your transaction{" "}
                  <a
                    href={`https://goerli.etherscan.io/tx/${data?.hash}`}
                    target="_blank"
                    className="text-blue-500"
                  >
                    here
                  </a>
                </p>
              </>
            ) : isLoading ? (
              <Loader />
            ) : (
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
            )
          ) : (
            <button
              disabled={true}
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            >
              You need to connect your wallet first
            </button>
          )}{" "}
        </div>

        <Stepper
          step={2}
          onPrevClick={() => {
            router.push("/");
          }}
        />
      </main>
    </>
  );
}
