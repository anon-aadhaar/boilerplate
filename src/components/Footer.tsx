import { FunctionComponent } from "react";
import imgGithub from "../../public/github-mark.png";
import imgPSE from "../../public/pse.png";
import Image from "next/image";

export const Footer: FunctionComponent = () => {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="pr-5">
          <a target={"_blank"} rel={"noreferrer"} href="https://pse.dev/">
            <Image alt="pse" src={imgPSE} width={45} height={45}></Image>
          </a>
        </div>
        <div className="pl-5">
          <a
            target={"_blank"}
            rel={"noreferrer"}
            href="https://github.com/privacy-scaling-explorations/anon-aadhaar"
          >
            <Image alt="github" src={imgGithub} width={45} height={45}></Image>
          </a>
        </div>
      </div>
    </>
  );
};
