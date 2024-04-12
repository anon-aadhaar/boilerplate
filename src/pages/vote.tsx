/* eslint-disable react/no-unescaped-entities */
import { useAnonAadhaar, useProver } from "@anon-aadhaar/react";
import {
  AnonAadhaarCore,
  packGroth16Proof,
  deserialize,
} from "@anon-aadhaar/core";
import {
  useEffect,
  useState,
  SetStateAction,
  Dispatch,
  useContext,
} from "react";
import { Ratings } from "@/components/Ratings";
import { Stepper } from "@/components/Stepper";
import { Loader } from "@/components/Loader";
import { useRouter } from "next/router";
import { useAccount, useContractWrite } from "wagmi";
import anonAadhaarVote from "../../public/AnonAadhaarVote.json";
import { UserStatus } from "@/interface";
import { hasVoted } from "@/utils";
import { AppContext } from "./_app";

type VoteProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
};

export default function Vote({ setUserStatus }: VoteProps) {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const { useTestAadhaar } = useContext(AppContext);
  const [, latestProof] = useProver();
  const [voted, setVoted] = useState(false);
  const [anonAadhaarCore, setAnonAadhaarCore] = useState<AnonAadhaarCore>();
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const [rating, setRating] = useState<string>();
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: `0x${
      useTestAadhaar
        ? process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_TEST
        : process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD || ""
    }`,
    abi: anonAadhaarVote.abi,
    functionName: "voteForProposal",
  });

  const sendVote = async (
    _rating: string,
    _anonAadhaarCore: AnonAadhaarCore
  ) => {
    const packedGroth16Proof = packGroth16Proof(
      _anonAadhaarCore.proof.groth16Proof
    );
    write({
      args: [
        _rating,
        process.env.NEXT_PUBLIC_NULLIFIER_SEED!,
        _anonAadhaarCore.proof.nullifier,
        _anonAadhaarCore.proof.timestamp,
        address,
        [
          _anonAadhaarCore.proof.ageAbove18,
          _anonAadhaarCore.proof.gender,
          _anonAadhaarCore.proof.pincode,
          _anonAadhaarCore.proof.state,
        ],
        packedGroth16Proof,
      ],
    });
  };

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      deserialize(latestProof as unknown as string).then(
        (proof: AnonAadhaarCore) => {
          setAnonAadhaarCore(proof);
        }
      );
    }
  }, [anonAadhaar, latestProof]);

  useEffect(() => {
    address
      ? hasVoted(address.toString(), useTestAadhaar).then((response) =>
          setVoted(response)
        )
      : null;
  }, [address, useTestAadhaar]);

  useEffect(() => {
    isConnected
      ? setUserStatus(UserStatus.WALLET_CONNECTED)
      : setUserStatus(UserStatus.WALLET_NOT_CONNECTED);
  }, [isConnected, setUserStatus]);

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto rounded-2xl w-full sm:max-w-screen-sm p-2 sm:p-8 justify-between">
        <h1 className="font-bold text-sm sm:text-2xl">
          Anon Aadhaar Example - Vote
        </h1>
        <div className="text-sm sm:text-lg">
          Next, you have the option to connect your wallet and cast your vote
          alongside your Anon Aadhaar proof. Your vote will be paired with your
          proof, and the smart contract will initially verify your proof before
          processing your vote.
        </div>

        <div className="flex flex-col items-center gap-5">
          {voted ? (
            <>
              Thank you for casting your vote. Your participation is greatly
              appreciated.
            </>
          ) : (
            <>
              <div className="text-sm sm:text-lg font-medium">
                On a scale of 0 to 5, how likely are you to recommend this hack?
              </div>
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
                    <div className="font-bold">
                      You can check your transaction{" "}
                      <a
                        href={`https://sepolia.etherscan.io/tx/${data?.hash}`}
                        target="_blank"
                        className="text-blue-500"
                      >
                        here
                      </a>
                    </div>
                  </>
                ) : isLoading ? (
                  <Loader />
                ) : (
                  <button
                    disabled={
                      rating === undefined || anonAadhaarCore === undefined
                    }
                    type="button"
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => {
                      if (rating !== undefined && anonAadhaarCore !== undefined)
                        sendVote(rating, anonAadhaarCore);
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
                  You need to connect your wallet first ⬆️
                </button>
              )}
            </>
          )}
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
