import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect, createContext, SetStateAction } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import {
  w3mConnectors,
  w3mProvider,
  EthereumClient,
} from "@web3modal/ethereum";
import { Header } from "../components/Header";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import { Footer } from "@/components/Footer";
import { UserStatus } from "@/interface";

const chains = [sepolia];
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
export const AppContext = createContext({
  useTestAadhaar: false,
  setIsTestMode: (isTest: boolean) => {},
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [userStatus, setUserStatus] = useState<UserStatus>(
    UserStatus.LOGGED_OUT
  );
  const [ready, setReady] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <>
      <Head>
        <title>Anon Aadhaar Example</title>
        <meta property="og:title" content="Anon Aadhaar Example" key="title" />
        <meta
          property="og:image"
          content="https://anon-aadhaar-example.vercel.app/AnonAadhaarBanner.png"
          key="image"
        />
        <meta
          property="og:description"
          name="description"
          content="A Next.js example app that integrate the Anon Aadhaar SDK."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <AppContext.Provider
          value={{ useTestAadhaar: isTestMode, setIsTestMode: setIsTestMode }}
        >
          <WagmiConfig config={wagmiConfig}>
            <AnonAadhaarProvider _useTestAadhaar={isTestMode}>
              <div className="flex flex-col h-screen justify-between">
                <Header />
                <Component
                  {...pageProps}
                  setUserStatus={setUserStatus}
                  setIsTestMode={setIsTestMode}
                />
                <Footer />
              </div>
            </AnonAadhaarProvider>
          </WagmiConfig>
        </AppContext.Provider>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
