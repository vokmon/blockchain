import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '', network: '' }
  }

  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const address = 'http://localhost:7545';
    const web3 = new Web3(new Web3.providers.HttpProvider(address));
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.net.getNetworkType();
    this.setState( {account: accounts[0], network});
  }

  render() {
    return (
      <div className="container">
        <h1>Hello world!!</h1>
        <p>Your account is {this.state.account} from {this.state.network} network</p>
      </div>
    );
  }
}

export default App;
