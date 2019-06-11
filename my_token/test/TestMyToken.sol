pragma solidity >=0.4.21 <0.6.0;

import 'truffle/Assert.sol';
import 'truffle/DeployedAddresses.sol';
import '../contracts/MyToken.sol';

contract TestMyToken {

  MyToken mytoken;

  string _name = 'My Token';
  string _symbol = 'MTK';
  uint _decimals = 18;

  function beforeEach() public {
    mytoken = MyToken(DeployedAddresses.MyToken());
  }

  function testCorrectName() public {
      string memory name = mytoken.name();
      Assert.equal(name, _name, 'Invalid token name');
  }

  function testCorrectSymbol() public {
      string memory symbol = mytoken.symbol();
      Assert.equal(symbol, _symbol, 'Invalid symbol');
  }

  function testCorrectDecimals() public {
      uint decimals = mytoken.decimals();
      Assert.equal(decimals, _decimals, 'Invalid symbol');
  }
}