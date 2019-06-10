import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS, URL } from './config'
import TodoList from './TodoList';
class App extends Component {

  constructor(props) {
    super(props)
    this.state = { account: '', network: '', tasks:[], loading: true }
  }

  componentWillMount() {
    this.initAndLoad();
  }

  async initAndLoad() {
    await this.initTodoList();
    await this.loadBlockchainData();
  }
  async initTodoList() {
    this.setState({loading: true});
    const web3 = new Web3(new Web3.providers.HttpProvider(URL));
    const accounts = await web3.eth.getAccounts();
    const network = await web3.eth.net.getNetworkType();
    this.setState( {account: accounts[0], network});

    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    this.setState({ todoList });
  }

  async loadBlockchainData() {
    this.setState({loading: true});
    const taskCount = await this.state.todoList.methods.taskCount().call();
    this.setState({ taskCount })
    const tasks = [];
    for (var i = 1; i <= taskCount; i++) {
      const task = await this.state.todoList.methods.tasks(i).call()
      tasks.push(task);
    }

    this.setState({loading: false, tasks});
  }

  createTask = async (content) => {
    
    this.setState({ loading: true });

      // check this 
      // https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
      this.state.todoList.methods.createTask(content).send({ from: this.state.account },(error, transactionHash) =>{
        this.loadBlockchainData();
      })
      .once('receipt', (receipt) => {
        this.loadBlockchainData();
      });
  }

  toggleCompleted = (taskId) => {
    this.setState({ loading: true });
    this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account },(error, transactionHash) =>{
      this.setState({ loading: false });
      this.loadBlockchainData();
    });
  }

  render() {
    return (
    <div>
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small><a className="nav-link" href="#"><span id="account"><p>Your account is {this.state.account} from {this.state.network} network</p></span></a></small>
        </li>
      </ul>
    </nav>
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-lg-12 d-flex justify-content-center">
          {
            this.state.loading? 
            (<div id="loader" className="text-center">
              <p className="text-center">Loading...</p>
            </div>):
            <TodoList tasks = {this.state.tasks} createTask = {this.createTask} toggleCompleted = {this.toggleCompleted} />
          }
        </main>
      </div>
    </div>
  </div>
    );
  }
}

export default App;
