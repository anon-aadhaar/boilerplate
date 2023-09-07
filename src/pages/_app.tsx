import "@/styles/globals.css";
import Head from "next/head";
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

const chains = [goerli];
const projectId = "3847cb13165d77585e8aec4981f95f98";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Add the Country Identity Provider at the root of your app
    <WagmiConfig config={wagmiConfig}>
      <AnonAadhaarProvider>
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
          <Component {...pageProps} />
        </div>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </AnonAadhaarProvider>
    </WagmiConfig>
  );
}
