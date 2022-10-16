// 基于 web3.js v1.8.0   https://web3js.readthedocs.io/en/v1.8.0/web3.html

const Web3 = require('web3')
const Tx = require('@ethereumjs/tx').Transaction;
const fs = require('fs')
const ini = require('ini')

const winston = require('winston');

// https://www.npmjs.com/package/winston
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),  // json  logstash  printf  prettyPrint  simple
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'local.log' })
//     ]
// });

const init = _ => {
    const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
    const rpcURL = config.node.rpc_url
    // const ws_url = config.node.ws_url

    const web3Obj = new Web3(Web3.givenProvider || rpcURL);  // 创建Web3连接
    // web3Obj.setProvider(ws_url);  // 更改Web3连接的Provider

    // IPC 作为 Provider
    // const net = require('net');
    // const web3Obj = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net);

    console.log('web3.js version:' + web3Obj.version);
    return web3Obj;
}

const web3Obj = init();

// 创建账户
const createAccount = async _ => {
    var newAccount = web3Obj.eth.accounts.create();
    var address = newAccount.address
    var privateKey = newAccount.privateKey
    json = JSON.stringify({ address, privateKey });
    console.log(json);
    return json
}

// 获取账户余额，返回wei为单位的代币余额
const getBalance = async address => {
    return await web3Obj.eth.getBalance(address, (err, wei) => {
        if (err) {
            // throw new Error('Function getBalance:' + err)
            console.error('Function getBalance ' + err)
        } else {
            // 余额单位从wei转换为eth
            balance = web3Obj.utils.fromWei(wei, 'ether')
            json = JSON.stringify({ address, privateKey });
            console.log(json);
            console.log("address= " + address)
            console.log("balance= " + balance)
        }
    })
}

// 查看当前块高
const getBlockNumber = async _ => {
    await web3Obj.eth.getBlockNumber().then(console.log);
}

// 获取当前的Gas价格
const getGasPrice = async _ => {
    return await web3Obj.eth.getGasPrice((err, wei) => {
        if (err) {
            throw new Error('Function getGasPrice:' + err)
            // process.exit(1)
        }
        // 余额单位从wei转换为eth
        gasPrice = web3Obj.utils.fromWei(wei, 'Gwei')
        console.log("gasPrice maybe is: " + gasPrice + "Gwei")
    })
}

// 评估可能花费的Gas费
const getEstimateGas = async (tx) => {
    return await web3Obj.eth.estimateGas(tx, (err, gas) => {
        if (err) {
            // throw new Error('Function estimateGas:' + err)
            console.log('Function estimateGas:' + err);
            // process.exit(1)
        }
        console.log("Tx estimating gas is: " + gas)
    })
}

// 签名发送交易 // 发送交易前先评估费用，否则可能会由于设置的gasPrice过低，导致交易失败
// web3Obj.js 获取metamask签名进行交易 https://www.cxyzjd.com/article/xilibi2003/82700542
// const tx = {
//     // nonce值必须=（此账户已完成的交易数+1）。
//     // 可以缺省。
//     nonce: '0x00',   // web3.utils.toHex(nonceNum)
//     // 该交易每单位gas的价格, Gas价格目前以Gwei为单位（即10^9wei）, 其范围是大于0.1Gwei, 可进行灵活设置。
//     // 可以缺省。默认支付 web3Obj.eth.estimateGas(tx) Gas单位价格，应该是可以执行成功的最低价格。
//     gasPrice: '0x1000000000',  // web3.utils.toHex(10e9)
//     // 合约地址 或 账户地址.
//     to: contractAddress,
//     // gasLimit, 该交易支付的最高gas上限。该上限能确保在出现交易执行问题（比如陷入无限循环）之时, 交易账户不会耗尽所有资金。一旦交易执行完毕, 剩余所有gas会返还至交易账户。
//     gas: 21000,  // web3.utils.toHex(21000)
//     // 交易发送的以太币总量。
//     // 可以缺省,  缺省值为 0。
//     value: 0,
//     // this encodes the ABI of the method and the arguements；如果进行转账操作则设置data为空字符串
//     data: contractInstance.methods.buy(1, ["0x"]).encodeABI() 
// };
const signTransaction =  (rawTx, privateKey, network) => {
    let private_key_byte = Buffer.from(privateKey, 'hex');
    let tx = new Tx(rawTx, { 'chain': 'goerli' });
    let signedTx = tx.sign(private_key_byte);

    let serializedTx = signedTx.serialize();
    let signedTxStr = '0x' + serializedTx.toString('hex');
    return signedTxStr;
}

const sendSignedTransaction = async (signedTransaction) => {
    // web3Obj.eth.sendSignedTransaction(signedTransaction).on('receipt', console.log);
    // 广播交易
    web3Obj.eth.sendSignedTransaction(signedTransaction , (err, txHash) => {
        if (!err){
            hash = txHash
            console.log("success:" + txHash)
            return hash
        }else{
            console.log(err);
        }
    })
}

// 淘汰的方式
const signAndsendTransactionOldway = async (tx, privateKey) => {
    const signPromise = web3Obj.eth.accounts.signTransaction(tx, privateKey); // 对交易进行签名
    // 发送交易
    await signPromise.then(async (signedTx) => {
        // 对交易进行广播
        return await web3Obj.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    }).then(async (receipt, err) => {
        if (err) {
            console.log("Function sendSignedTransaction:", err)
        } else {
            console.log("Function sendSignedTransaction:", receipt)
        }
    }).catch((err) => {
        console.log("Function sendSignedTransaction:", err)
    });

    // // 签名交易
    // const signedTx = await web3Obj.eth.accounts.signTransaction(tx, privateKey); // 对交易进行签名
    // // 发送交易，并且进行监听
    // await web3Obj.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction).on('transactionHash', function(hash){
    //     console.log("发送成功, 获取交易hash: ",hash)
    // }).on('receipt', function(receipt){
    //     console.log("链上结果返回, 返回数据：",receipt)
    // }).on('confirmation', function(confirmationNumber, receipt){
    //     console.log("链上confirmation结果返回, 确认数: ",confirmationNumber)
    //     console.log("链上confirmation结果返回, 返回数据: ",receipt)
    // }).on('error', console.error);
}

const evaluateTxFee = async (tx) => {
    gasPrice = await getGasPrice()
    estimateGas = await getEstimateGas(tx)
    tx_wei = estimateGas * gasPrice;
    ether = web3Obj.utils.fromWei(tx_wei.toString(), 'ether')
    console.log("This tx maybe spend " + ether + "ETH");
    return tx_wei;
}

// 查看合约之前的所有事件
const getAllEvent = async contractInstance => {
    await contractInstance.getPastEvents(
        'AllEvents', // 过滤事件参数, 这里获取全部事件
        {
            fromBlock: 0, // 起始块
            toBlock: 'latest' // 终止块
        },
        (err, events) => { console.log(events) } // 回调函数
    )
}

module.exports = {
    Web3,
    web3Obj,
    createAccount,
    getBalance,
    getBlockNumber,
    getAllEvent,
    signAndsendTransactionOldway,
    signTransaction,
    sendSignedTransaction,
    getGasPrice,
    getEstimateGas,
    evaluateTxFee
};

// 导入方式
// const { web3Obj, createAccount, getBalance, getBlockNumber, getAllEvent, sendSignedTransaction, getGasPrice, getEstimateGas, evaluateTxFee } = require('./web3RPC')