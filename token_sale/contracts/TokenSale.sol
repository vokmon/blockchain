pragma solidity >=0.4.21 <0.6.0;

import './AwesomeToken.sol';
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract TokenSale {

  using SafeMath for uint256;

  // do not want to expose admin's address
  address private admin;

  AwesomeToken public tokenContract;

  uint256 public tokenPrice;

  uint256 public tokensSold;

  event Sell(address _buyer, uint256 _amount);

  constructor(AwesomeToken _tokenContract, uint256 _tokenPrice) public {
    // Assign an admin
    admin = msg.sender;

    // Token Contract
    tokenContract = _tokenContract;

    // Token Price
    tokenPrice = _tokenPrice;
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    // Require that value is equal to tokens
    require(msg.value == _numberOfTokens.mul(tokenPrice), 'Require that value is equal to tokens');

    // Require that the contract has enough tokens
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, 'cannot purchase more than available');

    // Require that a transfer is successful
    require(tokenContract.transfer(msg.sender, _numberOfTokens), 'Require that a transfer is successful');

    // Keep track of token sold
    tokensSold += _numberOfTokens;

    // Trigger Sell Event
    emit Sell(msg.sender, _numberOfTokens);
  }
}