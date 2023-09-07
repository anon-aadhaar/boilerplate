/* eslint-disable react/no-unescaped-entities */
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/router";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useAccount } from "wagmi";

export default function ConnectWallet() {
  // Use the Country Identity hook to get the status of the user.
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <>
      <main className="flex flex-col min-h-[70vh] mx-auto rounded-2xl max-w-screen-sm p-8 justify-between">
        <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
        <p>
          In order to process to the vote you'll need to have a wallet connected
          to Goerli, with some Goerli ETH to send your vote.
        </p>

        {/* Import the Connect Button component */}
        <div className="flex flex-col w-full place-content-center items-center gap-8">
          <p>You can now connect your wallet.</p>
          <Web3Button />
          {isConnected && <Web3NetworkSwitch />}
        </div>

        {isConnected ? (
          <Stepper
            step={2}
            onPrevClick={() => {
              router.push("/");
            }}
            onNextClick={() => {
              router.push("/vote");
            }}
          />
        ) : (
          <Stepper
            step={2}
            onPrevClick={() => {
              router.push("/");
            }}
          />
        )}
      </main>
      <Footer text={"First, generate an Anon Aadhaar proof"} />
    </>
  );
}
