const TokenSale = artifacts.require('TokenSale');

contract('TokenSale', (accounts) => {
  before(async () => {
    this.tokenSale = await TokenSale.deployed();
    this.tokenPrice = 1000000000000000; // in wei
  });

  it ('initializes the contract with the correct values', async() => {
    const address = await this.tokenSale.address;
    assert.notEqual(address, 0x0, 'has contract address');

    const tokenContractAddress = await this.tokenSale.tokenContract();
    assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');

    const price = await this.tokenSale.tokenPrice();
    assert.equal(price, this.tokenPrice, 'token price is correct');
  });
});