const MyToken = artifacts.require('MyToken');

// for assertion
require('chai').should();

contract('MyToken', (accounts) => {

  before(async () => {
    this.token = await MyToken.deployed()
  })

  describe('token attributes', async () => {
    const _name = 'My Token';
    const _symbol = 'MTK';
    const _decimals = 18;

    it('has the correct name', async () => {
      const name = await this.token.name();
      name.should.equal(_name);
    });

    it('has the correct symbol', async () => {
      const symbol = await this.token.symbol();
      symbol.should.equal(_symbol);
    });

    it('has the correct decimals', async () => {
      const decimals = await this.token.decimals();
      decimals.toNumber().should.equal(_decimals);
    });
  });
});