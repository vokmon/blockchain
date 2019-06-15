pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol';

/**
 * This token extends ERC20 from openzeppelin.
 * So we get the mandatory implementation for free
 * e.g. totalSupply but we need to set the initial value in the constructor
 */
contract AwesomeToken is ERC20, ERC20Detailed {

  string private _TOKEN_NAME = "Awesome Token";
  string private _SYMBOL = "AWT";
  uint8 private _DECIMALS = 18;

  // balance of token, who has token and how much
  // mapping(address => uint256) public balanceOf;

  // Constructor
  constructor(uint256 _initialSupply)
    ERC20Detailed(_TOKEN_NAME, _SYMBOL, _DECIMALS)
    public {
      // equilavent to balanceOf[msg.sender] = _initialSupply
      super._mint(msg.sender, _initialSupply);
  }

// See implementation in ERC20
// function totalSupply() public view returns (uint256)
// function allowance(address owner, address spender) public view returns (uint256) {
// function balanceOf(address account) public view returns (uint256) {
// function transfer(address recipient, uint256 amount) public returns (bool) 
// function approve(address spender, uint256 value) public returns (bool) {
// function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {

// See event declaration in IERC20
// event Transfer(address indexed from, address indexed to, uint256 value);
// event Approval(address indexed owner, address indexed spender, uint256 value);
}