const fs = require('fs')
const ini = require('ini')
const {web3Obj, createAccount, getBalance, sendTransaction, getBlockNumber, getAllEvent, signTransaction} = require('./web3RPC')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const privateKey=config.privateKey
const accountArr = ["0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D", ""]

const contractReceiveEther = async _ =>{
    // 获取合约实例
    const source = fs.readFileSync("../build/contracts/ReceiveEther.json", 'utf8'); 
    abi = JSON.parse(source).abi
    const contractAddress = '0xA3F8e70e7244eb2aA6a7181A259A9DD01A7eB5Ac'
    const contractInstance = new web3Obj.eth.Contract(abi, contractAddress)

    // const tx = {
    //     to: contractAddress,
    //     gas: 8000000,
    //     data: contractInstance.methods.test().encodeABI() 
    // };
    // await signTransaction(tx, privateKey)

    await contractInstance.methods.varAddress().call((err, result) => { console.log("temp1=", err, result) })
    await contractInstance.methods.varNum().call((err, result) => { console.log("temp2=",err, result) })
}

const contractSendEther = async _ =>{
    // 获取合约实例
    const source = fs.readFileSync("../build/contracts/SendEther.json", 'utf8'); 
    abi = JSON.parse(source).abi
    const contractAddress = '0xE5D0d289a8A7eA7010F07d9608fb0fA05ecD2CF4'
    const contractInstance = new web3Obj.eth.Contract(abi, contractAddress)
    
    
    const tx = {
        to: contractAddress,
        gas: 8000000,
        value: 1000000000000000000,
        data: contractInstance.methods.sendViaCall('0xA3F8e70e7244eb2aA6a7181A259A9DD01A7eB5Ac').encodeABI() 
    };
    await signTransaction(tx, privateKey)
}


(async _ =>{ 
    // await contractReceiveEther()
    await contractSendEther()
    await getBalance('0xA3F8e70e7244eb2aA6a7181A259A9DD01A7eB5Ac')
    await getBalance('0xE5D0d289a8A7eA7010F07d9608fb0fA05ecD2CF4')
    
})()
