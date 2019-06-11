const MyToken = artifacts.require("MyToken");

module.exports = function(deployer) {
  const _name = 'My Token';
  const _symbol = 'MTK';
  const _decimals = 18;
  deployer.deploy(MyToken, _name, _symbol, _decimals);
};
