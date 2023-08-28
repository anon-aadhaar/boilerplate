import Head from "next/head";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "anon-aadhaar-react";
import { useEffect } from "react";
import { Footer } from "../../components/Footer";

export default function Home() {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

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
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <main className="flex flex-col items-center gap-8 bg-white rounded-2xl max-w-screen-sm mx-auto h-[20rem] p-8">
          <h1 className="font-bold text-2xl">
            Welcome to Anon Aadhaar Example
          </h1>
          <p>Prove your Identity anonymously using your Aadhaar card.</p>

          {/* Import the Connect Button component */}
          <LogInWithAnonAadhaar />
          <Footer />
        </main>
        <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
          {/* Render the proof if generated and valid */}
          {anonAadhaar?.status === "logged-in" && (
            <>
              <p>✅ Proof is valid</p>
              <p>Got your Aadhaar Identity Proof</p>
              <>Welcome anon!</>
              <AnonAadhaarProof
                code={JSON.stringify(anonAadhaar.pcd, null, 2)}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
