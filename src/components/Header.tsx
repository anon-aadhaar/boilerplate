import { FunctionComponent } from "react";
import Image from "next/image";
import imgGithub from "../../public/github-mark.png";
import imgPSE from "../../public/pse.png";

type HeaderProps = {};

export const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <header className="">
      <div className="flex items-center justify-end m-5">
        <div className="pr-2">
          <a target={"_blank"} rel={"noreferrer"} href="https://pse.dev/">
            <Image alt="pse" src={imgPSE} width={25} height={25}></Image>
          </a>
        </div>
        <div className="pl-2">
          <a
            target={"_blank"}
            rel={"noreferrer"}
            href="https://github.com/privacy-scaling-explorations/anon-aadhaar"
          >
            <Image alt="github" src={imgGithub} width={25} height={25}></Image>
          </a>
        </div>
      </div>
    </header>
  );
};
