import { ethers } from "ethers";
import { FunctionComponent, useEffect, useState } from "react";
import votingAbi from "../../public/Vote.json";

export type VoteResultsProps = {};

const getTotalVotes = async (): Promise<number> => {
  const provider = ethers.getDefaultProvider(
    `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_GOERLI_PROVIDER_ID}`
  );
  const voteContract = new ethers.Contract(
    "0x" + process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    votingAbi.abi,
    provider
  );

  const proposalCount = await voteContract.getProposalCount();

  // Initialize a variable to store the total vote count
  let totalVoteCount = 0;

  // Iterate through the proposals and sum their vote counts
  for (let i = 0; i < proposalCount; i++) {
    const voteCount = await voteContract.getProposal(i);
    totalVoteCount += Number(voteCount[1]);
  }

  return totalVoteCount;
};

export const VoteResults: FunctionComponent<VoteResultsProps> = ({}) => {
  const [totalVote, setTotalVote] = useState(0);

  useEffect(() => {
    getTotalVotes().then((total) => setTotalVote(total));
  });

  return <div className="flex w-full justify-between pt-6">{totalVote}</div>;
};
