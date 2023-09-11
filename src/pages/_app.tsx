import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "anon-aadhaar-react";
import {
  w3mConnectors,
  w3mProvider,
  EthereumClient,
} from "@web3modal/ethereum";
import { Header } from "../components/Header";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { Web3Modal } from "@web3modal/react";
import { Footer } from "@/components/Footer";
import { UserStatus } from "@/interface";

const chains = [goerli];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [userStatus, setUserStatus] = useState<UserStatus>(
    UserStatus.LOGGED_OUT
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      {ready ? (
        <WagmiConfig config={wagmiConfig}>
          <AnonAadhaarProvider>
            <Head>
              <title>Anon Aadhaar Example</title>
              <meta
                name="description"
                content="A Next.js example app that integrate the Anon Aadhaar SDK."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="sm:hidden">
              {/* Display this on small screens (mobile) */}
              <div className="text-center">
                <main className="flex flex-col min-h-[70vh] mx-auto rounded-2xl max-w-screen-sm p-8 justify-between">
                  <Header />
                  <h1 className="font-bold">
                    Sorry, Anon Aadhaar is not compatible with mobile devices
                    yet.
                  </h1>
                  <p>See you on your Desktop :)</p>
                  <div></div>
                </main>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex flex-col h-screen bg-gray-100 justify-between">
                <Header />
                <Component
                  {...pageProps}
                  setUserStatus={setUserStatus}
                  userStatus={userStatus}
                />
                <Footer text={userStatus} />
              </div>
            </div>
          </AnonAadhaarProvider>
        </WagmiConfig>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
