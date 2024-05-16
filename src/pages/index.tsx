/* eslint-disable react/no-unescaped-entities */
import { LaunchProveModal, useAnonAadhaar } from "@anon-aadhaar/react";
import { Dispatch, useEffect, SetStateAction, useContext } from "react";
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";
import { useAccount } from "wagmi";
import { AppContext } from "./_app";
import { boolean } from "hardhat/internal/core/params/argumentTypes";
import { useWeb3Modal } from "@web3modal/react";

type HomeProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
};

export default function Home({ setUserStatus }: HomeProps) {
  const [anonAadhaar] = useAnonAadhaar();
  const { useTestAadhaar, setIsTestMode } = useContext(AppContext);
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();
  const router = useRouter();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      router.push("./vote");
    }
  }, [anonAadhaar, router]);

  const switchAadhaarMode = (isTest: boolean) => {
    setIsTestMode(isTest);
  };

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto justify-center items-center w-full p-4">
        <div className="max-w-4xl w-full">
          <h6 className="text-[36px] font-rajdhani font-medium leading-none">
            ANON AADHAAR
          </h6>
          <h2 className="text-[90px] font-rajdhani font-medium leading-none">
            EXAMPLE VOTING APP
          </h2>
          <div className="text-md mt-4 mb-8 text-[#717686]">
            This process ensures anonymity by utilizing the Aadhaar secure QR
            code (present on e-Aadhaar and the printed Aadhaar letter) which
            preserves the confidentiality of the Aadhaar number.
          </div>

          <div className="flex w-full gap-8 mb-8">
            {isConnected ? (
              <div>
                <p className="font-rajdhani font-medium mb-2">
                  CHOOSE YOUR MODE:
                </p>
                <div className="flex gap-4 place-content-center">
                  {useTestAadhaar ? (
                    <button
                      className="bg-[#EDFFED] rounded-lg text-[#009A08] px-6 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                      onClick={() => switchAadhaarMode(false)}
                    >
                      TRY REAL CREDENTIALS
                    </button>
                  ) : (
                    <button className="bg-[#009A08] rounded-lg text-white px-6 py-1 border-2 border-[#009A08] font-rajdhani font-medium">
                      TRY REAL CREDENTIALS
                    </button>
                  )}
                  {useTestAadhaar ? (
                    <button className="bg-[#009A08] rounded-lg text-white px-6 py-1 border-2 border-[#009A08] font-rajdhani font-medium">
                      TRY TEST CREDENTIALS
                    </button>
                  ) : (
                    <button
                      className="bg-[#EDFFED] rounded-lg text-[#009A08] px-6 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
                      onClick={() => switchAadhaarMode(true)}
                    >
                      TRY TEST CREDENTIALS
                    </button>
                  )}
                </div>
                <p className="font-rajdhani font-medium my-2">START:</p>
                <LaunchProveModal
                  nullifierSeed={Number(
                    process.env.NEXT_PUBLIC_NULLIFIER_SEED!
                  )}
                  signal={address}
                  buttonStyle={{
                    borderRadius: "8px",
                    border: "solid",
                    borderWidth: "1px",
                    boxShadow: "none",
                    fontWeight: 600,
                    borderColor: "#009A08",
                    color: "#009A08",
                    fontFamily: "rajdhani",
                  }}
                  buttonTitle={"LOGIN"}
                />
              </div>
            ) : (
              <button
                className="bg-[#009A08] rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
                onClick={() => open()}
              >
                CONNECT WALLET
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
