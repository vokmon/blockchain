pragma solidity ^0.5.0;

contract Election {

  // Model a candidate
  struct Candidate {
    uint id;
    string name;
    uint voteCount;
  }

  // In Solidity, there is no way to determine the size of a mapping, and no way to iterate over it, either.
  // Read/write Candidates
  mapping (uint => Candidate) public candidates;
  // Store Candidates Count
  uint public candidateCount;

  //constructor
  constructor() public {
    addCandidate("Candidate 1");
    addCandidate("Candidate 2");
  }

  function addCandidate(string memory _name) private {
    candidateCount++;
    candidates[candidateCount] = Candidate(candidateCount, _name, 0);
  }
}