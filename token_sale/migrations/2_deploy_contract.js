const AwesomeToken = artifacts.require("AwesomeToken");

module.exports = function(deployer) {
  const _initialSupply = 1000000;
  deployer.deploy(AwesomeToken, _initialSupply);
};
