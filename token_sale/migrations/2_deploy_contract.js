const AwesomeToken = artifacts.require("AwesomeToken.sol");
const TokenSale = artifacts.require("TokenSale.sol");

// cannot be async function
module.exports = function(deployer) {
  // Initial suply is 1,000,000 tokens
  const _initialSupply = 1000000;

  // Token price is 0.001 Ether
  const _tokenPrice = 1000000000000000;

  deployer.deploy(AwesomeToken, _initialSupply).then(
    function() {
      return deployer.deploy(TokenSale, AwesomeToken.address, _tokenPrice);
    }
  )
  
};
