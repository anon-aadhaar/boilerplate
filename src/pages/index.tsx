/* eslint-disable react/no-unescaped-entities */
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { Dispatch, useEffect, useState, SetStateAction } from "react";
import { IdentityPCD } from "anon-aadhaar-pcd";
import { Stepper } from "../components/Stepper";
import { useRouter } from "next/router";
import { UserStatus } from "@/interface";

const truncate = (str: string, max: number, len: number) => {
  return str.length > max ? str.substring(0, len) + "..." : str;
};

type HomeProps = {
  setUserStatus: Dispatch<SetStateAction<UserStatus>>;
};

export default function Home({ setUserStatus }: HomeProps) {
  // Use the Country Identity hook to get the status of the user.
  const [anonAadhaar] = useAnonAadhaar();
  const [pcd, setPcd] = useState<IdentityPCD>();
  const router = useRouter();

  useEffect(() => {
    if (anonAadhaar.status === "logged-in") {
      setPcd(anonAadhaar.pcd);
      setUserStatus(UserStatus.LOGGED_IN);
    } else {
      setUserStatus(UserStatus.LOGGED_OUT);
    }
  }, [anonAadhaar, setUserStatus]);

  return (
    <>
      <main className="flex flex-col min-h-[70vh] mx-auto rounded-2xl max-w-screen-sm p-8 justify-between">
        <h1 className="font-bold text-2xl">Welcome to Anon Aadhaar Example</h1>
        <p>
          First, you'll need to login with your Aadhaar card, the login process
          will generate a proof that you're Aadhaar card is signed by the Indian
          government and then verifies this proof to log you in.
        </p>
        <p>Prove your Identity anonymously using your Aadhaar card.</p>

        {/* Import the Connect Button component */}
        <div className="flex w-full place-content-center">
          <LogInWithAnonAadhaar />
        </div>

        {pcd && anonAadhaar.status === "logged-in" ? (
          <>
            <div className="border-black rounded-lg border p-8 bg-white w-full">
              <div className="flex flex-col gap-y-2">
                <p className="">
                  {"Modulus: " + truncate(pcd.proof.modulus.toString(), 40, 40)}
                </p>
                <p className="">
                  {"Pi_a: " + truncate(pcd.proof.proof.pi_a.toString(), 40, 40)}
                </p>
                <p>
                  {"Pi_b: " + truncate(pcd.proof.proof.pi_b.toString(), 40, 40)}
                </p>
                <p>
                  {"Pi_c: " + truncate(pcd.proof.proof.pi_c.toString(), 40, 40)}
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
            <Stepper step={1} />
          </>
        )}
      </main>
    </>
  );
}
