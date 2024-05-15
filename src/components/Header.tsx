import { FunctionComponent, useMemo } from "react";
import Image from "next/image";
// import imgGithub from "../../public/github-mark.png";
// import imgPSE from "../../public/pse.png";
// import { VoteResults } from "./VoteResults";
import { Web3Button, Web3NetworkSwitch, useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
import { icons } from "./illustrations";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const Header: FunctionComponent = () => {
  const { isConnected, address } = useAccount();
  const blob = new Blob([icons.aalogo], { type: "image/svg+xml" });
  const aaLogo = useMemo(() => URL.createObjectURL(blob), [icons.aalogo]);
  const { open } = useWeb3Modal();

  return (
    <header className="flex flex-row justify-between">
      <div className="flex flex-row items-center mx-5">
        <Image
          priority
          src={aaLogo}
          width={40}
          height={40}
          alt="Follow us on Twitter"
        />
      </div>
      <div className="flex flex-row gap-3 items-center justify-end">
        {/* <VoteResults /> */}
        {/* {process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD ? (
          <a
            href={`https://sepolia.etherscan.io/address/0x${process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD}`}
            target={"_blank"}
            className="text-black font-light text-sm hover:underline "
          >
            {shortenAddress(
              "0x" + process.env.NEXT_PUBLIC_VOTE_CONTRACT_ADDRESS_PROD
            )}
          </a>
        ) : null} */}

        <div className="flex m-5 items-center space-x-2">
          {/* <Web3Button /> */}
          {isConnected ? (
            <button
              className="bg-[#EDFFED] rounded-lg text-[#009A08] px-6 py-1 border-2 border-[#009A08] font-rajdhani font-medium"
              onClick={() => open()}
            >
              {address && shortenAddress(address)}
            </button>
          ) : (
            <button
              className="bg-[#009A08] rounded-lg text-white px-6 py-1 font-rajdhani font-medium"
              onClick={() => open()}
            >
              CONNECT WALLET
            </button>
          )}
          {/* {isConnected && <Web3NetworkSwitch />} */}
        </div>
        {/* <div className="">
          <a target={"_blank"} rel={"noreferrer"} href="https://pse.dev/">
            <Image alt="pse" src={imgPSE} width={25} height={25}></Image>
          </a>
        </div> */}
        {/* <div className="">
          <a
            target={"_blank"}
            rel={"noreferrer"}
            href="https://github.com/privacy-scaling-explorations/anon-aadhaar"
          >
            <Image alt="github" src={imgGithub} width={25} height={25}></Image>
          </a>
        </div> */}
      </div>
    </header>
  );
};
