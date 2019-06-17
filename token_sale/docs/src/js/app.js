App = {
  contracts: {},
  loading: false,
  tokenPrice: 0,
  tokensSold: 0,
  tokensAvailable: 750000,

  deployedTokenSaleInstance: null,
  deployedTokenInstance: null,

  loader: $('#loader'),
  content: $('#content'),

  init: () => {
    console.log('Initialized...');
    return App.initWeb3();
  },

  initWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access..
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    return App.initContracts();
  },

  initContracts: () => {
    $.getJSON('TokenSale.json', (tokenSale) => {
      App.contracts.tokenSale = TruffleContract(tokenSale);
      App.contracts.tokenSale.setProvider(App.web3Provider);
      App.contracts.tokenSale.deployed().then((deployedTokenSale) => {
        App.deployedTokenSaleInstance = deployedTokenSale;
        console.log('Token sale address:', App.deployedTokenSaleInstance.address);
      });
    }).done(() => {
        $.getJSON('AwesomeToken.json', (token) => {
          App.contracts.token = TruffleContract(token);
          App.contracts.token.setProvider(App.web3Provider);
          App.contracts.token.deployed().then((deployedToken) => {
            App.deployedTokenInstance = deployedToken;
            console.log('Token address:', App.deployedTokenInstance.address);

            App.listenForEvents();
            return App.render();
          });
      });
    });
  },

  listenForEvents: ()=> {
    App.deployedTokenSaleInstance.Sell({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch((error, event) => {
      console.log("event triggered", event);
      App.render();
    });
  },

  render: () => {
    if(App.loading) {
      return;
    }

    App.loading = true;
    App.loader.show();
    App.content.hide();

    web3.eth.getCoinbase((err, account) => {
      if(err === null) {
        App.account= account;
        $('#accountAddress').html('Your Account: ' + account);

        App.deployedTokenInstance.balanceOf(App.account).then((balance) => {
          $('.my-balance').html(balance.toNumber());
        });
      }
    });

    App.deployedTokenSaleInstance.tokenPrice().then((tokenPrice) => {
      App.tokenPrice = tokenPrice;
      $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());

      return App.deployedTokenSaleInstance.tokensSold();
    }).then((tokensSold) => {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);

      return App.deployedTokenInstance.balanceOf(App.deployedTokenSaleInstance.address);
      
    }).then((tokensAvailable) => {
      // App.tokensAvailable = tokensAvailable.toNumber();
      $('.tokens-available').html(App.tokensAvailable);
      
      var progressPercent = (Math.ceil(App.tokensSold) / tokensAvailable.toNumber()) * 100;
      $('#progress').css('width', progressPercent + '%');

      App.loading = false;
      App.loader.hide();
      App.content.show();
    });

  },

  buyTokens: () => {
    const numberOfTokens = $('#numberOfTokens').val();
    
    const x = {
      from: App.account,
      value: numberOfTokens * App.tokenPrice.toNumber(),
      gas: 50000
    }

    console.log(x);
    App.deployedTokenSaleInstance.buyTokens(numberOfTokens, {
      from: App.account,
      value: numberOfTokens * App.tokenPrice.toNumber(),
      gas: 100000
    }).then((result) => {
      console.log('Tokens bough...', result);
      $('form').trigger('reset');
      App.loader.hide();
      App.content.show();
    }).catch((e) => {
      console.log(e);
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});