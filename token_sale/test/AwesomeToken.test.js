const AwesomeToken = artifacts.require('AwesomeToken');

contract('AwesomeToken', (accounts) => {

  before(async () => {
    this.token = await AwesomeToken.deployed()
  })

  describe('token attributes', async () => {
    const _name = 'Awesome Token';
    const _symbol = 'AWT';
    const _decimals = 18;
    const _totalSupply = 1000000;

    it('set the total supply upon deployment', async () => {
      const totalSupply = await this.token.totalSupply();
      assert.equal(totalSupply.toNumber(), _totalSupply, 'sets the total supply to 1,000,000');

      const adminAddress = accounts[0];
      const adminBalance = await this.token.balanceOf(adminAddress);
      assert.equal(adminBalance.toNumber(), _totalSupply, 'it allocates the initial supply to admin account');
    });

    it('has correct token name', async () => {
      const tokenName = await this.token.name();
      assert.equal(tokenName, _name, 'has correct name');
    });

    it('has correct token symbol', async () => {
      const symbol = await this.token.symbol();
      assert.equal(symbol, _symbol, 'has correct symbol');
    });

    it('transfers token ownership', async() => {
      try {
        const result = await this.token.transfer(accounts[1], 99999999999);
      }
      catch(error) {
        assert(error.message.indexOf('revert')>=0, 'error message must contain revert');
      }

      const adminAddress = accounts[0];
      const toAddress = accounts[1];
      //this.token.transfer.call -> does not create a transaction
      //this.token.transfer() -> will trigger a transaction
      const receipt = await this.token.transfer(toAddress, 250000, {from: adminAddress});
      const success = await this.token.transfer.call(toAddress, 250000, {from: adminAddress});
      assert.equal(success, true, 'it returns true');

      // assert the event is correctly triggered
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      const log = receipt.logs[0];
      assert.equal(log.event, 'Transfer', 'should be the "Transfer"event');
      assert.equal(log.args.from, adminAddress, 'logs the account the tokens are transferred from');
      assert.equal(log.args.to, toAddress, 'logs the account the tokens are transferred to');
      assert.equal(log.args.value, 250000, 'logs the transfer amount');

      const toBalance = await this.token.balanceOf(toAddress);
      assert.equal(toBalance.toNumber(), 250000, 'adds the amount to the receiving account');

      const adminBalance = await this.token.balanceOf(adminAddress);
      assert.equal(adminBalance.toNumber(), 750000, 'deducts amount from the sender account');

    });

    it('approves tokens for delegated transfer', async() => {
      // does not create a transaction without writing a block to the blockchain
      const success = await this.token.approve.call(accounts[1], 100);
      assert.equal(success, true, 'it returns true');


      const senderAddress = accounts[0];
      const spenderAddress = accounts[1];
      const receipt = await this.token.approve(spenderAddress, 100);
      // assert the event is correctly triggered
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      const log = receipt.logs[0];
      assert.equal(log.event, 'Approval', 'should be the "Approval"event');
      assert.equal(log.args.owner, senderAddress, 'logs the account the tokens are arthorized by');
      assert.equal(log.args.spender, spenderAddress, 'logs the account the tokens are authorized to');
      assert.equal(log.args.value, 100, 'logs the transfer amount');

      // validate
      const allowance = await this.token.allowance(senderAddress, spenderAddress);
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer')
    });
  });
});