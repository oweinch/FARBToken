 require("dotenv").config({path: '../.env'})
const Web3 = require('web3');



//   connection.end();

// pwd: Ethuser123

// DB_HOST=192.168.1.105
// DB_USER='ethuser'
// DB_PASSWORD='Ethuser123'
// DATABASE='farbtoken_db'


//mysql --host=localhost --user=myname --password=password mydb

let networkId;
let ETH_NODE_URL;
let DEFAULT_ACCOUNT;

//USAGE Example: node interact.js -n rinkeby -a 0xc53540FbFe6d66785477f2238B38282Dd04daF62
// -n required
// -a required (by default it gives balance of DEFAULT_ACCOUNT)
//Commander import
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');

//RUN using command node interact.js -n rinkeby
console.log(process.env.INFURA_API_KEY)
program
  .requiredOption('-n, --network <networkId>', 'Network Id') //default is 5777
  .option('-a, --address <ETHAddress>', 'Ethereum Address', process.env.DEFAULT_ACCOUNT_TESTNET)
program.parse(process.argv);

  switch (program.network) {
    case 'ropsten':
        console.log(`Running on ${program.network} ........`);
         networkId = "3";
         ETH_NODE_URL="wss://ropsten.infura.io/ws/v3/" + process.env.INFURA_API_KEY
         DEFAULT_ACCOUNT=process.env.DEFAULT_ACCOUNT_TESTNET;
        break;

    case 'kovan':
        console.log(`Running on ${program.network} ........`);
        networkId = "42";
        ETH_NODE_URL="wss://kovan.infura.io/ws/v3/" + process.env.INFURA_API_KEY
        DEFAULT_ACCOUNT=process.env.DEFAULT_ACCOUNT_TESTNET;
        break;
   
    case 'rinkeby':
         console.log(`Running on ${program.network} ........`);
         networkId = "4";
         ETH_NODE_URL="wss://rinkeby.infura.io/ws/v3/" + process.env.INFURA_API_KEY
         DEFAULT_ACCOUNT=process.env.DEFAULT_ACCOUNT_TESTNET;
         break;
    
    case 'mainnet':
        console.log(`Running on ${program.network} ........`);
        networkId = "1";
        ETH_NODE_URL="wss://mainnet.infura.io/ws/v3/" + process.env.INFURA_API_KEY
        DEFAULT_ACCOUNT=process.env.DEFAULT_ACCOUNT_MAINNET;
        break;

    default:
        console.log(`Error: Network Id Not specified.` );
        console.log(`Usage: --network <networkId> to specify ethereum network`);
        console.log('Available Values: ropsten ,  rinkeby , kovan , mainnet or dev2');
        console.log('Default: dev2 (5777)');
        networkId = "5777";
        ETH_NODE_URL="wss://172.27.160.1:7545"
        break;
    }


//INITIALIZE WEB3
    const web3 = new Web3(
        new Web3.providers.WebsocketProvider(ETH_NODE_URL)
      );
    
//set Default Account:
web3.eth.defaultAccount = DEFAULT_ACCOUNT; //RInkeyby ETH address

//READ CONTRACT JSON
    const FARBTokenArifact = require('../build/contracts/FARBToken.json');
    const tokenContractAddress =  FARBTokenArifact.networks[networkId].address;
    const contractAbi = FARBTokenArifact.abi;

    const tokenContract = new web3.eth.Contract(contractAbi, tokenContractAddress);
        //  console.log(tokenContract)

//         async function run() {
//             const totalSupply = await tokenContract.methods.totalSupply().call();
         
//             const name = await tokenContract.name().call();
//             const symbol = tokenContract.symbol().call();
//             console.log(totalSupply);
//         }
// run();





    // ethPrice = web3.utils.toBN('1').mul(web3.utils.toBN(results.expectedRate)).div(ONE_WEI);
 const walletAddress=program.address; 

    const init = async () => {
    
        //array tokeninfo
    const tokenInfo = await Promise.all([
        tokenContractAddress,
        tokenContract.methods.name().call(),
        tokenContract.methods.symbol().call(),
        tokenContract.methods.totalSupply().call(),
        tokenContract.methods.balanceOf(walletAddress).call()
      ]);
      
      const tokenName = tokenInfo[1];
      const tokenSymbol = tokenInfo[2];
      const tokenTotSupply = web3.utils.fromWei(web3.utils.toBN(tokenInfo[3]).toString(),  'ether') //Print in real number without decimals
      const tokenBalance = web3.utils.fromWei(web3.utils.toBN(tokenInfo[4]).toString(),  'ether') 

      console.log(`*************** ${walletAddress} *******************`)
      console.log(`TOKEN NAME: ${tokenName}     SYMBOL : ${tokenSymbol}`)
      console.log(`-----------------------------------------------------`)
      console.log(`TOTAL SUPPLY  : ${tokenTotSupply}`)
      console.log(`TOKEN BALANCE : ${tokenBalance}`)
      console.log(`-----------------------------------------------------`)


      if ( tokenBalance > 1000 ) {
            console.log("Display: Enroll for Arbitrage")    
            // Store address in mySQL database, log enroll date, address
            // On an hourly basis run a job that scans all of these address in MySQL database and remove any address that does not satisfy the condition
            // 
      } else {
            console.log("Display: Balance not sufficient for Arbitrage")    
      }

    }

    init()












// contract.methods.balanceOf(myAddress).call().then(function(balance){console.log(balance)})


// web3.eth.getDefaultAccount = process.env.DEFAULT_ACCOUNT;

// var defaultAccount = web3.eth.getDefaultAccount;
// console.log('DefaultAccount => ', defaultAccount);

// var total = myContractInstance.totalSupply();
// var balance = myContractInstance.balanceOf(defaultAccount);

// console.log('DefulatAccount total => ',total);
// console.log('DefaultAccount balance => ',balance);

// var to = '0x00..';
// var isAddress = web3.isAddress(to);

// console.log('isAddress(to) => ',isAddress);
// console.log('balanceOf(to) => ',myContractInstance.balanceOf(to));