pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

/**
 * This token extends ERC20 from openzeppelin.
 * So we get the mandatory implementation for free
 * e.g. totalSupply but we need to set the initial value in the constructor
 */
contract AwesomeToken is ERC20, ERC20Detailed {

  uint256 private _INITIAL_SUPPLY = 1000000;
  string private _TOKEN_NAME = "Awesome Token";
  string private _SYMBOL = "AWT";
  uint8 private _DECIMALS = 18;


  // Constructor
  constructor()
    ERC20Detailed(_TOKEN_NAME, _SYMBOL, _DECIMALS)
    public {
      super._mint(msg.sender, _INITIAL_SUPPLY);
  }
}