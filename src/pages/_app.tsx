import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CountryIdentityProvider } from "country-identity-kit";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Add the Country Identity Provider at the root of your app
    <CountryIdentityProvider>
      <Component {...pageProps} />
    </CountryIdentityProvider>
  );
}
