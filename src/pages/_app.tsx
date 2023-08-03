import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CountryIdentityProvider } from "country-identity-kit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CountryIdentityProvider>
      <Component {...pageProps} />
    </CountryIdentityProvider>
  );
}
