import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect, createContext } from "react";
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
  setVoted: (voted: boolean) => {},
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (voted) setIsDisplayed(true);
  }, [voted]);

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
          value={{
            useTestAadhaar: isTestMode,
            setIsTestMode: setIsTestMode,
            setVoted: setVoted,
          }}
        >
          <WagmiConfig config={wagmiConfig}>
            <AnonAadhaarProvider _useTestAadhaar={isTestMode}>
              <div className="relative min-h-screen flex flex-col justify-between">
                <div className="flex-grow">
                  <Header />
                  <Component {...pageProps} setIsTestMode={setIsTestMode} />
                </div>
                <Footer
                  isDisplayed={isDisplayed}
                  setIsDisplayed={setIsDisplayed}
                />
              </div>
            </AnonAadhaarProvider>
          </WagmiConfig>
        </AppContext.Provider>
      ) : null}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}
