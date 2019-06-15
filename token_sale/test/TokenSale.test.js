const TokenSale = artifacts.require('TokenSale');
const AwesomeToken = artifacts.require('AwesomeToken');

contract('TokenSale', (accounts) => {
  before(async () => {
    this.tokenSale = await TokenSale.deployed();
    this.token = await AwesomeToken.deployed();
    this.tokenPrice = 1000000000000000; // in wei
    this.admin = accounts[0];
    this.tokenAvailable = 750000
    this.buyer = accounts[1];
  });

  it ('initializes the contract with the correct values', async() => {
    const address = await this.tokenSale.address;
    assert.notEqual(address, 0x0, 'has contract address');

    const tokenContractAddress = await this.tokenSale.tokenContract();
    assert.notEqual(tokenContractAddress, 0x0, 'has token contract address');

    const price = await this.tokenSale.tokenPrice();
    assert.equal(price, this.tokenPrice, 'token price is correct');
  });

  it('facilitated token buying', async() =>{
    //provision 75% of all tokens to the token sale
    //admin give tokenSale contract 75% of the token sales
    await this.token.transfer(this.tokenSale.address, this.tokenAvailable, {from: this.admin});
    const b = await this.token.balanceOf(this.tokenSale.address);
    assert.equal(b.toNumber(), this.tokenAvailable, 'Token sale contract has tokens 75% of the total supply');

    const b2 = await this.token.balanceOf(this.admin);
    assert.equal(b2.toNumber(), 250000, 'AwesomeToken contract has tokens 25% of the total supply');

    const numberOfTokens = 10;
    const value = numberOfTokens * this.tokenPrice;
    const receipt = await this.tokenSale.buyTokens(numberOfTokens, {from: this.buyer, value: value});
    // console.log(receipt);
    // assert the event is correctly triggered
    assert.equal(receipt.logs.length, 1, 'triggers one event');
    const log = receipt.logs[0];
    assert.equal(log.event, 'Sell', 'should be the "Sell" event');
    assert.equal(log.args._buyer, this.buyer, 'logs the account that purchased the tokens');
    assert.equal(log.args._amount, numberOfTokens, 'logs the number of the tokens purchased');
    
    const amount = await this.tokenSale.tokensSold();
    assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
    const balanceAfterSold = await this.token.balanceOf(this.tokenSale.address);
    const reamingBalance = this.tokenAvailable - numberOfTokens;
    assert.equal(balanceAfterSold.toNumber(), this.tokenAvailable - numberOfTokens, 'balance of token sale contract is updated')

    // Try to buy tokens different from the ether value
    try {
      const receipt2 = await this.tokenSale.buyTokens(numberOfTokens, {from: this.buyer, value: 1});
      assert.throws();
    }
    catch (e) {
      assert(e.message.indexOf('revert')>=0, 'error message must contain revert', 'msg.value must equal number of tokens in wei');
    }
    
    try {
      const receipt3 = await this.tokenSale.buyTokens(800000, {from: this.buyer, value: 800000*this.tokenPrice});
      assert.throws();
    }
    catch (e) {
      assert(e.message.indexOf('cannot purchase more than available')>=0, 'cannot purchase more than available');
    }

    const b3 = await this.token.balanceOf(this.tokenSale.address);
    assert.equal(b3.toNumber(), reamingBalance, 'Token sale contract remain unchanged');

  });
});