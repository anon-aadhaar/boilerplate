/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { AnonAadhaarPCD } from "anon-aadhaar-pcd";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/router";
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react";
import { useAccount, useConnect } from "wagmi";

export default function Vote() {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [pcd, setPcd] = useState<AnonAadhaarPCD>();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { data } = useConnect();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
    console.log("data: ", data);
    if (anonAadhaar.status === "logged-in") setPcd(anonAadhaar.pcd);
  }, [anonAadhaar, data]);

  return (
    <>
      <Head>
        <title>Anon Aadhaar Example</title>
        <meta
          name="description"
          content="A Next.js example app that integrate the Anon Aadhaar SDK."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-screen bg-gray-100 justify-between">
        <Header />
        <main className="flex flex-col gap-8 mx-auto rounded-2xl max-w-screen-sm p-8 justify-start">
          <h1 className="font-bold text-2xl">
            Welcome to Anon Aadhaar Example
          </h1>
          <p>Now you can connect your wallet.</p>

          {/* Import the Connect Button component */}
          <div className="flex w-full place-content-center gap-8">
            <Web3Button />
            {isConnected && <Web3NetworkSwitch />}
          </div>

          <Stepper step={2} />
        </main>
        <Footer text={"First, generate an Anon Aadhaar proof"} />
      </div>
    </>
  );
}
