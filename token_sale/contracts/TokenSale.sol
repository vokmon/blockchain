pragma solidity >=0.4.21 <0.6.0;

import './AwesomeToken.sol';

contract TokenSale {

  // do not want to expose admin's address
  address private admin;

  AwesomeToken public tokenContract;

  uint256 public tokenPrice;

  constructor(AwesomeToken _tokenContract, uint256 _tokenPrice) public {
    // Assign an admin
    admin = msg.sender;

    // Token Contract
    tokenContract = _tokenContract;

    // Token Price
    tokenPrice = _tokenPrice;
  }
}