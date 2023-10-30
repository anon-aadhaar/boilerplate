/* eslint-disable react/no-unescaped-entities */
import { LogInWithAnonAadhaar, LogInWithAnonAadhaarV2, useAnonAadhaar } from "anon-aadhaar-react";
import { Dispatch, useEffect, useState, SetStateAction } from "react";
import { Stepper } from "../components/Stepper";
import {Toggle} from "../components/Toggles"
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";
import { TestFiles } from "@/components/TestFiles";

const truncate = (str: string, max: number, len: number) => {
  return str.length > max ? str.substring(0, len) + "..." : str;
};

type HomeProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
};

export default function Home({ setUserStatus }: HomeProps) {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [withCert, setWithCert] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    anonAadhaar.status === "logged-in"
      ? setUserStatus(UserStatus.LOGGED_IN)
      : setUserStatus(UserStatus.LOGGED_OUT);
  }, [anonAadhaar, setUserStatus]);

  return (
    <>
      <main className="flex flex-col min-h-[75vh] mx-auto rounded-2xl max-w-screen-sm p-8 justify-between">
        <h1 className="font-bold text-2xl">Anon Aadhaar Example - Login</h1>
        <div>
          Initially, you'll need to log in using your Aadhaar card. During the
          login process, a proof is generated to confirm the authenticity of
          your Aadhaar card, which is signed by the Indian government. This
          proof is then verified to grant you access.
          <br></br>
          Verify your identity anonymously using your Aadhaar card.
        </div>

        {/* Import the Connect Button component */}
        <div className="flex w-full place-content-center">
          {withCert ? <LogInWithAnonAadhaar /> : <LogInWithAnonAadhaarV2 />}
        </div>

        {anonAadhaar.status === "logged-in" ? (
          <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 flex border-black rounded-lg border p-8 bg-white">
            <div className="flex flex-col gap-y-2">
              <p className="">
                {"Modulus: " +
                  truncate(anonAadhaar.pcd.proof.modulus.toString(), 25, 25)}
              </p>
              <p className="">
                {"Pi_a: " +
                  truncate(
                    anonAadhaar.pcd.proof.proof.pi_a.toString(),
                    25,
                    25
                  )}
              </p>
              <p>
                {"Pi_b: " +
                  truncate(
                    anonAadhaar.pcd.proof.proof.pi_b.toString(),
                    25,
                    25
                  )}
              </p>
              <p>
                {"Pi_c: " +
                  truncate(
                    anonAadhaar.pcd.proof.proof.pi_c.toString(),
                    25,
                    25
                  )}
              </p>
            </div>
          </div>
          <Stepper
            step={1}
            onNextClick={() => {
              router.push("/vote");
            }}
          />
          </>
        ) : (
          <>
            <div className="flex self-center flex-col">
            <Toggle withCert={withCert} setWithCert={setWithCert} /> 
            </div>
            <TestFiles />
            <Stepper step={1} />
          </>
        )}
      </main>
    </>
  );
}
