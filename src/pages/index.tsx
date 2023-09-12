/* eslint-disable react/no-unescaped-entities */
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { Dispatch, useEffect, SetStateAction } from "react";
import { Stepper } from "../components/Stepper";
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
        <p>
          Initially, you'll need to log in using your Aadhaar card. During the
          login process, a proof is generated to confirm the authenticity of
          your Aadhaar card, which is signed by the Indian government. This
          proof is then verified to grant you access.
          <br></br>
          Verify your identityanonymously using your Aadhaar card.
        </p>

        {/* Import the Connect Button component */}
        <div className="flex w-full place-content-center">
          <LogInWithAnonAadhaar />
        </div>

        {anonAadhaar.status === "logged-in" ? (
          <>
            <div className="border-black rounded-lg border p-8 bg-white w-full">
              <div className="flex flex-col gap-y-2">
                <p className="">
                  {"Modulus: " +
                    truncate(anonAadhaar.pcd.proof.modulus.toString(), 40, 40)}
                </p>
                <p className="">
                  {"Pi_a: " +
                    truncate(
                      anonAadhaar.pcd.proof.proof.pi_a.toString(),
                      40,
                      40
                    )}
                </p>
                <p>
                  {"Pi_b: " +
                    truncate(
                      anonAadhaar.pcd.proof.proof.pi_b.toString(),
                      40,
                      40
                    )}
                </p>
                <p>
                  {"Pi_c: " +
                    truncate(
                      anonAadhaar.pcd.proof.proof.pi_c.toString(),
                      40,
                      40
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
            <TestFiles />
            <Stepper step={1} />
          </>
        )}
      </main>
    </>
  );
}
