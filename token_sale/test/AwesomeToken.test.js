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
    });

  });
});