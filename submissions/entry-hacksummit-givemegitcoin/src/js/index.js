import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
class App extends React.Component {
   constructor(props){
      super(props)
      this.state = {
         lastWinner: 0,
         numberOfBets: 0,
         minimumBet: 0,
         totalBet: 0,
         maxAmountOfBets: 0,
         urlToFix: "",
			}

			if(typeof web3 != 'undefined'){
         console.log("Using web3 detected from external source like Metamask")
         this.web3 = new Web3(web3.currentProvider)
      }else{
         console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
         this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
      }

			const MyContract = web3.eth.contract(
[
	{
		"constant": false,
		"inputs": [],
		"name": "generateNumberWinner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "urlToFix",
				"type": "bytes32"
			}
		],
		"name": "bet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfBets",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "player",
				"type": "address"
			}
		],
		"name": "checkPlayerExists",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "resetData",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "playerInfo",
		"outputs": [
			{
				"name": "amountBet",
				"type": "uint256"
			},
			{
				"name": "urlToFix",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "numberWinner",
				"type": "uint256"
			}
		],
		"name": "distributePrizes",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimumBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "urlToFix",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "maxAmountOfBets",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_minimumBet",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
]
			)
      this.state.ContractInstance = MyContract.at("0xc0068242c02ce935f4fffeb4e8c3047955844b8b")
   }

	componentDidMount(){
		this.updateState()
		// this.setupListeners()
		setInterval(this.updateState.bind(this), 10e3)
  }

	updateState(){
		this.state.ContractInstance.minimumBet((err, result) => {
			 if(result != null){
					this.setState({
						 minimumBet: parseFloat(web3.fromWei(result, 'ether'))
					})
			 }
		})
      this.state.ContractInstance.totalBet((err, result) => {
         if(result != null){
            this.setState({
               totalBet: parseFloat(web3.fromWei(result, 'ether'))
            })
         }
      })
      this.state.ContractInstance.numberOfBets((err, result) => {
         if(result != null){
            this.setState({
               numberOfBets: parseInt(result)
            })
         }
      })
      this.state.ContractInstance.maxAmountOfBets((err, result) => {
         if(result != null){
            this.setState({
               maxAmountOfBets: parseInt(result)
            })
         }
      })
   }

// Listen for events and executes the voteNumber method
   // setupListeners(){
    //  let url = this.refs['url-to-fix'].value
		//	this.refs.numbers.querySelectorAll('li')
    //  liNodes.forEach(number => {
    //     number.addEventListener('click', event => {
    //        event.target.className = 'number-selected'
    //        this.voteNumber(parseInt(event.target.innerHTML), done => {
// Remove the other number selected
    //           for(let i = 0; i < liNodes.length; i++){
    //              liNodes[i].className = ''
    //           }
    //        })
    //     })
    //  })
//   }

	submitBet(event){
		let url = toString(this.refs['url-to-fix'].value)
		let bet = this.refs['ether-bet'].value
		console.log("has bet")

		if(!bet) bet = 0.1
		if(parseFloat(bet) < this.state.minimumBet){
         alert('You must bet more than the minimum')
      } else {
         this.state.ContractInstance.bet(url, {
            gas: 300000,
            from: web3.eth.accounts[0],
            value: web3.toWei(bet, 'ether')
         }, (err, result) => {
         })
      }
		event.preventDefault()
	}

	render(){
      return (
         <div className="main-container">
            <h1>Put your Ether where your <i>code-fixer</i> mouth is</h1>
<div className="block">
               <b>Url to issue to fix:</b> &nbsp;
               <span>{this.state.urlToFix}</span>
            </div>
<div className="block">
               <b>Number of bets:</b> &nbsp;
               <span>{this.state.numberOfBets}</span>
            </div>
<div className="block">
               <b>Last number winner:</b> &nbsp;
               <span>{this.state.lastWinner}</span>
            </div>
<div className="block">
               <b>Total ether bet:</b> &nbsp;
               <span>{this.state.totalBet} ether</span>
            </div>
<div className="block">
               <b>Minimum bet:</b> &nbsp;
               <span>{this.state.minimumBet} ether</span>
            </div>
<div className="block">
               <b>Max amount of bets:</b> &nbsp;
               <span>{this.state.maxAmountOfBets} ether</span>
            </div>
<hr/>
	<h2>Bet on the fix:</h2>
	<form>
		<label>
			 <b>How much Ether do you want to bet? <input className="bet-input" ref="ether-bet" type="number" placeholder={this.state.minimumBet}/></b> ether
			 <br/>
		</label>
		<label>
			<b>Which issue you are fixing (url to the issue)? <input ref="url-to-fix" type="text" className="bet-input" placeholder={this.state.urlToFix} /></b>
		</label>
		<br/>
		<button class="button" type="button" onClick={this.submitBet.bind(this)}>Bet!</button>
  </form>
</div>
		  )
   }
}
ReactDOM.render(
   <App />,
   document.querySelector('#root')
)
