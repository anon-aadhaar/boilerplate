/* eslint-disable react/no-unescaped-entities */
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { Dispatch, useEffect, SetStateAction, useContext } from "react";
import { Stepper } from "../components/Stepper";
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";
import { useAccount } from "wagmi";
import { AppContext } from "./_app";

type HomeProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
  setIsTestMode: Dispatch<SetStateAction<boolean>>;
};

export default function Home({ setUserStatus, setIsTestMode }: HomeProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const { isConnected, address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    anonAadhaar.status === "logged-in"
      ? setUserStatus(UserStatus.LOGGED_IN)
      : setUserStatus(UserStatus.LOGGED_OUT);
  }, [anonAadhaar, setUserStatus]);
  const { useTestAadhaar } = useContext(AppContext);

  const switchAadhaar = () => {
    setIsTestMode(!useTestAadhaar);
  };

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto rounded-2xl w-full sm:max-w-screen-sm p-4 sm:p-8 justify-between">
        <h1 className="font-bold text-sm sm:text-2xl">
          Anon Aadhaar Example - Login
        </h1>
        <div className="text-sm sm:text-lg">
          Initially, you'll need to log in using your Aadhaar card. During the
          login process, a proof is generated to confirm the authenticity of
          your Aadhaar card, which is signed by the Indian government. This
          proof is then verified to grant you access.
          <br></br>
          Verify your identity anonymously using your Aadhaar card.
        </div>

        <div className="flex w-full place-content-center gap-8">
          {isConnected ? (
            <div>
              <div className="flex gap-8 place-content-center">
                <LogInWithAnonAadhaar
                  nullifierSeed={Number(
                    process.env.NEXT_PUBLIC_NULLIFIER_SEED!
                  )}
                  signal={address}
                />
                <button
                  onClick={switchAadhaar}
                  type="button"
                  className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Switch for {useTestAadhaar ? "real" : "test"}
                </button>
              </div>
              <h3 className="flex font-light text-lg mt-5 text-center">
                You're using the
                <p className="font-bold">
                  &ensp;
                  {useTestAadhaar ? "test" : "real"} &ensp;
                </p>
                Aadhaar mode
              </h3>
            </div>
          ) : (
            <button
              disabled={true}
              type="button"
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            >
              You need to connect your wallet first ⬆️
            </button>
          )}
        </div>

        {anonAadhaar.status === "logged-in" ? (
          <>
            <Stepper
              step={1}
              onNextClick={() => {
                router.push("/vote");
              }}
            />
          </>
        ) : (
          <>
            <Stepper step={1} />
          </>
        )}
      </main>
    </>
  );
}
