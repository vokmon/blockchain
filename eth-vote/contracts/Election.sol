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
  uint public candidatesCount;

  mapping (address => bool) public voters;

  //constructor
  constructor() public {
    addCandidate("Candidate 1");
    addCandidate("Candidate 2");
  }

  function addCandidate(string memory _name) private {
    candidatesCount++;
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
  }

  function vote(uint _candidateId) public {
    //require that they haven't voted before
    require(!voters[msg.sender], 'You have already voted!');

    //require a valid candidate
    require(_candidateId > 0 && _candidateId <= candidatesCount, 'Invalid candidate id!');

    // record that voter has voted
    voters[msg.sender] = true;

    // update candidate vote Count
    candidates[_candidateId].voteCount ++;
  }
}