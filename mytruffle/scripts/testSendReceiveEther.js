const fs = require('fs')
const ini = require('ini')
const {web3Obj, createAccount, getBalance, sendTransaction, getBlockNumber, getAllEvent, signTransaction} = require('./web3RPC')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const privateKey=config.privateKey
const contractReceiveEtherAddress = '0x36fD462CE19b194C110E30B3a69658aD701971c9'
const contractSendEtherAddress = '0x8F8D63960D34cf3Fd2E3Ab917a20b7dD83D9c008'

const contractReceiveEther = async _ =>{
    // 获取合约实例
    const source = fs.readFileSync("../build/contracts/ReceiveEther.json", 'utf8'); 
    abi = JSON.parse(source).abi
    const contractAddress = contractReceiveEtherAddress
    const contractInstance = new web3Obj.eth.Contract(abi, contractAddress)

    // const tx = {
    //     to: contractAddress,
    //     gas: 8000000,
    //     data: contractInstance.methods.test().encodeABI() 
    // };
    // await signTransaction(tx, privateKey)

    await contractInstance.methods.varAddress().call((err, result) => { console.log("varAddress=", err, result) })
    await contractInstance.methods.varNum().call((err, result) => { console.log("varNum=",err, result) })
}

const contractSendEther = async _ =>{
    // 获取合约实例
    const source = fs.readFileSync("../build/contracts/SendEther.json", 'utf8'); 
    abi = JSON.parse(source).abi
    const contractAddress = contractSendEtherAddress
    const contractInstance = new web3Obj.eth.Contract(abi, contractAddress)
    await contractInstance.methods.temp2().call((err, result) => { console.log("temp2=", err, result) })
    const tx = {
        to: contractAddress,
        gas: 8000000,
        value: 1000000000000000000,
        data: contractInstance.methods.sendViaCall(contractReceiveEtherAddress).encodeABI() 
    };
    await signTransaction(tx, privateKey)
    await contractInstance.methods.temp2().call((err, result) => { console.log("temp2=", err, result) })
}


(async _ =>{ 
    await contractSendEther()
    // await contractReceiveEther()
    await getBalance(contractReceiveEtherAddress)
    await getBalance(contractSendEtherAddress)
})()
