import React,{Component} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery'
//const web3 = new Web3(window.web3.currentProvider);

class App extends Component{
state={
  manager:'',
  players: [],
  balance:'',
  value:'',
  message:''
};
async componentDidMount(){
  const manager=await lottery.methods.manager().call();
  const players = await lottery.methods.getPlayers().call();
  const balance= await web3.eth.getBalance(lottery.options.address);
  this.setState({manager,players,balance});
}
onSubmit=async (event)=>{
event.preventDefault();
const accounts=await web3.eth.getAccounts();

this.setState({message:'Waiting'});
await lottery.methods.enter().send({
  from: accounts[0],
  value: web3.utils.toWei(this.state.value,'ether')
});
this.setState({message:'Entered'});
};
onClick =async ()=>{
  const accounts = await web3.eth.getAccounts();
  this.setState({message:'Waiting'});
  await lottery.methods.pickwinner().send({
    from: accounts[0]
  });
  this.setState({message:'Success'});

}
render(){
  web3.eth.getAccounts().then(console.log);
  return (
    <div>
    <h2>Lottery</h2>
    <p>Manager is {this.state.manager}
    Current players : {this.state.players.length}
    Win ammount : {web3.utils.fromWei(this.state.balance,'ether')}</p>
    <hr />
    <form onSubmit={this.onSubmit}>
    <h4>Want to try?</h4>
    <div>
    <label>Amount of ether to enter</label>
    <input
    value={this.state.value}
    onChange={event=>this.setState({value: event.target.value})}
    />
    </div>
    <button>Enter</button>
    </form>
    <hr/>
    <h4>Pick Winner?</h4>
    <button onClick={this.onClick}>Pick</button>
    <hr/>
    <h1>{this.state.message}</h1>
    </div>
  );
}
}


export default App;
