const Web3 = require('web3')
const fs = require('fs')
const ini = require('ini')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const rpcURL = config.node.rpc_url

const web3Obj = new Web3(rpcURL) // 创建Web3连接

// 创建账户/解锁账户  
// 非私链上, 请务必不要进行解锁操作, 否则任何第三方都可以直接通过你的账户地址进行相关操作
const createAccount = async _ => {
    // 方式一
    var newAccount = web3Obj.eth.accounts.create();
    var address = newAccount.address
    var privateKey = newAccount.privateKey
    console.log("address = " + address, "\nprivateKey = " + privateKey)
    // web3Obj.eth.accounts.privateKeyToAccount(privateKey) // 解锁账户
    return address

    // 方式二
    // password="123456"
    // await web3Obj.eth.personal.newAccount(password,(err, address)=>{
    //     console.log(address)
    //     web3Obj.eth.personal.unlockAccount(address, password, 14400).then(console.log('Account unlocked!'));
    // });
    // // 返回账户列表；通过 web3Obj.eth.accounts.create() 创建的账户不会被添加到这个列表中
    // await web3Obj.eth.personal.getAccounts().then(console.log);
}

// 例子
const keystoreExample = _ => {
    // 通过keystore解密出私钥
    keystoreJsonV3 = { "address": "907cc33c0b606f75836b6818beff2a926645b9ba", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "704ac767d5e8eee15719095941ce81f16a7bca11e500e5b44ba9044f08fcc8d4", "cipherparams": { "iv": "3986def9537641a6e39f13cfe95a9ecd" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 4096, "p": 6, "r": 8, "salt": "74f2d73f157386f0623d6dd957b4f777d08a608ec8e854bb04549520bc6deb96" }, "mac": "a049bec1d55115b830233f4861428c9c7874dbde575e8944b6d0892de8fd5040" }, "id": "91a56a11-6259-4a2c-b77e-06f57ba81381", "version": 3 }
    console.log(web3Obj.eth.accounts.decrypt(keystoreJsonV3, '密码'));

    // 通过私钥生成keystore
    let privateKey = '0x3ecd8ed343b61c028e612eb9f7149e2d88df51719c4ef7acf787b68a4f2bd44e'
    password = '123456'
    console.log(web3Obj.eth.accounts.encrypt(privateKey, password));
}

// 获取账户余额
const getBalance = async address => {
    await web3Obj.eth.getBalance(address, (err, wei) => {
        if (err) {
            throw new Error('Function getBalance:' + err)
            // exit(1)
        }
        // 余额单位从wei转换为eth
        balance = web3Obj.utils.fromWei(wei, 'ether')
        console.log("balance: " + balance)
        // return balance
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
            // exit(1)
        }
        // 余额单位从wei转换为eth
        gasPrice = web3Obj.utils.fromWei(wei, 'Gwei')
        console.log("gasPrice: " + gasPrice + "Gwei")
    })
}

// 评估可能花费的Gas费
const getEstimateGas = async (tx) => {
    return await web3Obj.eth.estimateGas(tx, (err, gas) => {
        if (err) {
            throw new Error('Function estimateGas:' + err)
            // exit(1)
        }
        console.log("gas: " + gas)
    })
}

// 查看合约之前的所有事件
const getAllEvent = async _ => {
    await contractInstance.getPastEvents(
        'AllEvents', // 过滤事件参数, 这里获取全部事件
        {
            fromBlock: 0, // 起始块
            toBlock: 'latest' // 终止块
        },
        (err, events) => { console.log(events) } // 回调函数
    )
}

// 签名发送交易
// web3Obj.js 获取metamask签名进行交易 https://www.cxyzjd.com/article/xilibi2003/82700542
// const tx = {
//     // nonce值必须=（此账户已完成的交易数+1）。
//     // 可以缺省。
//     nonce: '0x00',   // web3.utils.toHex(nonceNum)
//     // 该交易每单位gas的价格, Gas价格目前以Gwei为单位（即10^9wei）, 其范围是大于0.1Gwei, 可进行灵活设置。
//     // 可以缺省。
//     gasPrice: '0x2710',  // web3.utils.toHex(10e9)
//     // 合约地址 或 账户地址.
//     to: contractAddress,
//     // gasLimit, 该交易支付的最高gas上限。该上限能确保在出现交易执行问题（比如陷入无限循环）之时, 交易账户不会耗尽所有资金。一旦交易执行完毕, 剩余所有gas会返还至交易账户。
//     // 以太坊程序内部设置了矿工打包块交易的gas费不能超过8百万, 因此可以设置的最大值为8000000
//     // 可以缺省。
//     gas: 8000000,  // web3.utils.toHex(8000000)
//     // 交易发送的以太币总量。
//     // 可以缺省,  缺省值为 0。
//     value: 0,
//     // this encodes the ABI of the method and the arguements；如果进行转账操作则设置data为空字符串
//     data: contractInstance.methods.buy(1, ["0x"]).encodeABI() 
// };
const signTransaction = async (tx, privateKey) => {
    // 签名交易
    let signPromise = web3Obj.eth.accounts.signTransaction(tx, privateKey);
    // 发送交易
    await signPromise.then(async (signedTx) => {
        // 对交易进行广播
        return await web3Obj.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
    }).then(async (receipt, err) => {
        if (err) {
            console.log("Function signTransaction:", err)
        } else {
            console.log("Function signTransaction:", receipt)
        }
    }).catch((err) => {
        console.log("Function signTransaction:", err)
    });

    // // 签名交易
    // let signedTx = await web3Obj.eth.accounts.signTransaction(tx, privateKey);
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


module.exports = {
    web3Obj,
    createAccount,
    getBalance,
    getBlockNumber,
    getAllEvent,
    signTransaction,
    getGasPrice,
    getEstimateGas
};

// 导入方式
// const { web3Obj, createAccount, getBalance, getBlockNumber, getAllEvent, signTransaction, getGasPrice, getEstimateGas } = require('./web3RPC')