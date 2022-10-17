// 基于 web3.js v1.8.0   https://web3js.readthedocs.io/en/v1.8.0/web3.html
// import { bufferToHex } from 'ethereumjs-util';
const Web3 = require('web3')
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
            balanceETH = web3Obj.utils.fromWei(wei, 'ether');
            jsonObj = JSON.stringify({ address, balanceETH });
            console.log(jsonObj);
        }
    })
}

// 获取钱包地址的nonce值
const getAcountNonce = async wallet_address => {
    let nonce = await web3Obj.eth.getTransactionCount(wallet_address, (err, nonce) => {
        if (err) {
            console.error('Function getAcountNonce1 ' + err)
        } else {
            return nonce;
        }
    });
    let nonce_pending = await web3Obj.eth.getTransactionCount('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D', "pending", (err, nonce) => {
        if (err) {
            console.error('Function getAcountNonce2 ' + err)
        } else {
            return nonce;
        }
    });
    if (nonce != nonce_pending) {
        console.error("nonce不等于nonce_pending !!!");
    }
    return { nonce, nonce_pending };
}


// 查看当前块高
const getBlockNumber = async _ => {
    await web3Obj.eth.getBlockNumber().then(console.log);
}

// 获取当前的Gas价格，返回值的单位为 wei
const getGasPrice = async _ => {
    return await web3Obj.eth.getGasPrice((err, wei) => {
        if (err) {
            throw new Error('Function getGasPrice:' + err)
            // process.exit(1)
        }
        // 余额单位从wei转换为Gwei
        gasPrice = web3Obj.utils.fromWei(wei, 'Gwei')
        console.log("gasPrice maybe is: " + gasPrice + " Gwei")
    })
}

// 评估花费的Gas数量
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

// 评估完成此交易需要花费的以太坊代币
const evaluateTxFee = async (tx) => {
    gasPrice = await getGasPrice()
    estimateGas = await getEstimateGas(tx)
    tx_wei = estimateGas * gasPrice;
    ether = web3Obj.utils.fromWei(tx_wei.toString(), 'ether')
    console.log("This tx maybe spend " + ether + "ETH");
    return tx_wei;
}

// 签名发送交易 // 发送交易前先评估费用，否则可能会由于设置的gasPrice过低，导致交易失败
// const tx = {
//     // 此账户已完成的交易数+1。可以缺省。
//     nonce: '0',   // web3.utils.toHex(nonceNum)
//     // 该交易每单位gas的价格上限, Gas价格目前以Gwei为单位（即10^9wei）, 其范围是大于0.1Gwei, 可进行灵活设置。
//     // EIP-1559 后，如果没有设置maxPriorityFeePerGas和maxFeePerGas，则默认 maxPriorityFeePerGas 和 maxFeePerGas 都等于 gasPrice。
//     // 可以缺省。默认支付 web3Obj.eth.estimateGas(tx) Gas单位价格，可能可以执行成功的最低价格。
//     gasPrice: '1000000000',  // web3.utils.toHex(10e9) 
//     // 优先打包的矿工费，缺省值为 2.5 Gwei 
//     maxPriorityFeePerGas,
//     // 缺省值为上一个区块的 baseFeePerGas * 2 + maxPriorityFeePerGas
//     maxFeePerGas,
//     // 合约地址 或 账户地址.
//     to: contractAddress,
//     // gasLimit, 该交易支付的最高gas上限。该上限能确保在出现交易执行问题（比如陷入无限循环）之时, 交易账户不会耗尽所有资金。一旦交易执行完毕, 剩余所有gas会返还至交易账户。
//     gas: 21000,  // web3.utils.toHex(21000)
//     // 交易发送的以太币总量。可以缺省,缺省值为 0。
//     value: 0,
//     // this encodes the ABI of the method and the arguements；如果进行转账操作则设置data为空字符串。
//     data: contractInstance.methods.buy(1, ["0x"]).encodeABI() 
// };
const signTransaction = async (tx, privateKey) => {
    const signedTx = await web3Obj.eth.accounts.signTransaction(tx, privateKey).catch((err) => {
        console.log("Function signTransaction:", err)
    });
    return signedTx;
}

// 返回交易的实际gas费开销
const sendSignedTransaction = async (signedTx) => {
    // 广播交易
    return await web3Obj.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction).then( (receipt, err) => {
        if (err) {
            console.log("Function sendSignedTransaction err:", err)
        } else {
            console.log("Function sendSignedTransaction receipt:", receipt)
            let txFee_wei = receipt.effectiveGasPrice * receipt.gasUsed;
            let txFee_ETH = web3Obj.utils.fromWei(txFee_wei.toString(), "ether");
            return txFee_ETH;
        }
    });

    // // 广播交易，并且进行持续监听
    // await web3Obj.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction).on('transactionHash', function(hash){
    //     console.log("发送成功, 获取交易hash: ",hash)
    // }).on('receipt', function(receipt){
    //     console.log("链上结果返回, 返回数据：",receipt)
    // }).on('confirmation', function(confirmationNumber, receipt){
    //     console.log("链上confirmation结果返回, 确认数: ",confirmationNumber)
    //     console.log("链上confirmation结果返回, 返回数据: ",receipt)
    // }).on('error', console.error);
}

const signTransaction2 = (rawTx, privateKey, network) => {
    // const { Chain, Common, Hardfork } = require('@ethereumjs/common');
    const Tx = require('@ethereumjs/tx').Transaction;
    const bufferToHex = require('ethereumjs-util').bufferToHex;
    // const tx = Transaction.fromTxData(rawTx, { common })

    let tx = new Tx(rawTx, { chain: 'Goerli' });

    let private_key_byte = Buffer.from(privateKey, 'hex');
    let signedTx = tx.sign(private_key_byte); // 使用require('@ethereumjs/tx').Transaction进行签名的tx，tx里面的信息必须都是16进制的。

    if (signedTx.validate() && bufferToHex(signedTx.getSenderAddress()) === '0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D') {
        console.log('Correctly created the tx')
    } else {
        console.error('Invalid tx')
    }

    let serializedTx = signedTx.serialize();
    let signedTxStr = '0x' + serializedTx.toString('hex');

    return signedTxStr;
}

const sendSignedTransaction2 = async (signedTransaction) => {
    // web3Obj.eth.sendSignedTransaction(signedTransaction).on('receipt', console.log);
    // 广播交易
    web3Obj.eth.sendSignedTransaction(signedTransaction, (err, txHash) => {
        if (!err) {
            hash = txHash
            console.log("success:" + txHash)
            return hash
        } else {
            console.log(err);
        }
    })
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
    getAcountNonce,
    getBlockNumber,
    getAllEvent,
    signTransaction,
    sendSignedTransaction,
    signTransaction2,
    sendSignedTransaction2,
    getGasPrice,
    getEstimateGas,
    evaluateTxFee
};

// 导入方式
// const { web3Obj, createAccount, getBalance, getBlockNumber, getAllEvent, sendSignedTransaction, getGasPrice, getEstimateGas, evaluateTxFee } = require('./web3RPC')