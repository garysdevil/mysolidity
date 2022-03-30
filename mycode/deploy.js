// 编译
// https://stackoverflow.com/questions/53408632/code-not-compiling-in-nodejs-throws-out-an-unexpected-errorweb3-js
const path = require('path');
const fs = require('fs');
const solc = require('solc');


const inboxPath = path.resolve(__dirname, './', 'Coin.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

var solcInput = {
    language: "Solidity",
    sources: { 
        contract: {
            content: source
        }
     },
    settings: {
        optimizer: {
            enabled: true
        },
        evmVersion: "byzantium",
        outputSelection: {
            "*": {
              "": [
                "legacyAST",
                "ast"
              ],
              "*": [
                "abi",
                "evm.bytecode.object",
                "evm.bytecode.sourceMap",
                "evm.deployedBytecode.object",
                "evm.deployedBytecode.sourceMap",
                "evm.gasEstimates"
              ]
            },
        }
    }
};

solcInput = JSON.stringify(solcInput);
var contractObject = solc.compile(solcInput);
contractObject = JSON.parse(contractObject);


// console.log(contractObject.contracts.contract)
for (let contractName in contractObject.contracts.contract) {
    console.log("abi代码：")
    abicode=contractObject.contracts.contract[contractName].abi
    console.log(abicode);
    console.log("bin代码：")
    bytecode=contractObject.contracts.contract[contractName].evm.bytecode.object
    console.log(bytecode)
    console.log("gas费评估：")
    console.log(contractObject.contracts.contract[contractName].evm.gasEstimates)  
}



// 部署
// const Web3 = require('web3')
// const rpcURL = "http://127.0.0.1:8545" // 连接节点的地址
// const web3 = new Web3(rpcURL) // 创建Web3连接

// let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode});
// console.log('gasEstimate: ' + gasEstimate)
// let MyContract = web3.eth.contract(abicode);
// console.log('deploying contract...');
// let myContractReturned = MyContract.new([], {
//   from: address,
//   data: '0x' + bytecode,
//   gas: gasEstimate+50000
// }, function(err, myContract){
//   if(!err){
//     if(!myContract.address){
//       console.log(`myContract.transactionHash = ${myContract.transactionHash}`);
//     }else{
//       console.log(`myContract.address = ${myContract.address}`); // the contract address
//       global.contractAddress = myContract.address;
//     }
// }else{
//     console.log(err);
// }
// });