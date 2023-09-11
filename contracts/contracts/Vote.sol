// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

interface IVerifier {
    function verifyProof(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[32] memory input
    ) external view returns (bool);
}

contract Vote {
    // Structure to hold proposal information
    struct Proposal {
        string description;
        uint256 voteCount;
    }
    string public votingQuestion;
    address public verifierAddr;

    event Voted(address indexed _from, uint256 indexed _propositionIndex);

    // List of proposals
    Proposal[] public proposals;

    // Mapping to track if an address has already voted
    mapping(address => bool) public hasVoted;

    // Constructor to initialize proposals
    constructor(string memory _votingQuestion, string[] memory proposalDescriptions, address _verifierAddr) {
        verifierAddr = _verifierAddr;
        votingQuestion = _votingQuestion;
        for (uint256 i = 0; i < proposalDescriptions.length; i++) {
            proposals.push(Proposal(proposalDescriptions[i], 0));
        }
    }

    function verify(uint256[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[32] calldata _pubSignals) public view returns (bool) {
        return IVerifier(verifierAddr).verifyProof(_pA, _pB, _pC, _pubSignals);
    }

    // Function to vote for a proposal
    function voteForProposal(uint256 proposalIndex, uint256[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[32] calldata _pubSignals) public {
        require(proposalIndex < proposals.length, "Invalid proposal index");
        require(!hasVoted[msg.sender], "You have already voted");
        require(verify(_pA, _pB, _pC, _pubSignals), "Your idendity proof is not valid");

        proposals[proposalIndex].voteCount++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, proposalIndex);
    }

    // Function to get the total number of proposals
    function getProposalCount() public view returns (uint256) {
        return proposals.length;
    }

    // Function to get proposal information by index
    function getProposal(uint256 proposalIndex) public view returns (string memory, uint256) {
        require(proposalIndex < proposals.length, "Invalid proposal index");

        Proposal memory proposal = proposals[proposalIndex];
        return (proposal.description, proposal.voteCount);
    }

    // Function to get the total number of votes across all proposals
    function getTotalVotes() public view returns (uint256) {
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < proposals.length; i++) {
            totalVotes += proposals[i].voteCount;
        }
        return totalVotes;
    }    

    // Function to check if a user has already voted
    function checkVoted(address _addr) public view returns (bool) {
        return hasVoted[_addr];
    } 
}
