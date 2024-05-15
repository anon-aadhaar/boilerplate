import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import imgGithub from "../../public/github-mark.png";
import Image from "next/image";
import { AppContext } from "@/pages/_app";
import { shortenAddress } from "@/utils";
import { icons } from "./illustrations";

export const Footer: FunctionComponent = () => {
  const { useTestAadhaar } = useContext(AppContext);
  const [contractAddr, setContractAddr] = useState<string | null>(null);

  const blob = new Blob([icons.externalLink], { type: "image/svg+xml" });
  const externalLinkIcon = useMemo(
    () => URL.createObjectURL(blob),
    [icons.externalLink]
  );

  useEffect(() => {
    useTestAadhaar
      ? setContractAddr(process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_TEST!)
      : setContractAddr(process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD!);
  }, [useTestAadhaar]);

  return (
    <footer className="h-24 shadow-[0px_-5px_14px_0px_rgba(48,49,51,0.05)]">
      <div className="w-full mx-auto max-w-screen-xl h-full p-4 flex items-center justify-between">
        <div className="flex flex-row text-sm items-center text-black font-rajdhani font-medium gap-1">
          <p className="flex leading-none text-lg">TUTORIAL</p>
          <Image
            priority
            src={externalLinkIcon}
            width={20}
            height={20}
            alt="Check our tutorial"
            className="leading-none"
          />
        </div>
        <div className="flex flex-row text-sm text-black font-rajdhani font-medium justify-center items-center gap-8">
          <p className="underline">{shortenAddress("0x" + contractAddr)}</p>
          <a
            target={"_blank"}
            rel={"noreferrer"}
            href="https://github.com/privacy-scaling-explorations/anon-aadhaar"
          >
            <Image alt="github" src={imgGithub} width={25} height={25}></Image>
          </a>
        </div>
      </div>
    </footer>
  );
};
