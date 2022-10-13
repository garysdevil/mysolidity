const Web3 = require('web3')
const fs = require('fs')
const ini = require('ini')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const rpcURL = config.node.rpc_url

const web3Obj = new Web3(rpcURL) // 创建Web3连接

const accountArr = ["0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D",""]

// 私链转账以太坊
const sendTransaction = async (addressFrom, addressTo) =>{
    await web3Obj.eth.sendTransaction({
        from: addressFrom,
        to: addressTo,
        value: "1000000000000000000" // 1 eth
    })
    .then(function(receipt){
        console.log(receipt);
    });
}


// 私有网络，合约操作。
const private_network = _ =>{
    // 获取合约实例
    const source = fs.readFileSync("./Coin.json", 'utf8'); 
    abi = JSON.parse(source).abi
    const contractAddress = '0xdc64ae94db27325cdf53b9c336bbe5484100e177'
    const contractInstance = new web3Obj.eth.Contract(abi, contractAddress)

    // 查看abi接口
    console.log(contractInstance.options.jsonInterface)

    // 执行一次调用，并不会改变链上的状态
    contractInstance.methods.方法名(参数).call((err, result) =>  { console.log("error="+err+"\n"+"result="+result) })
    
    // 发送一次交易，会改变链上的状态
    contractInstance.methods.方法名(参数).send({from: 账户地址},(err, result) =>  { console.log("error="+err+"\n"+"result="+result) })
    contractInstance.methods.方法名(参数).send(
        {   from: accountArr[0],
            gasLimit: 3000000, 
            gas: 400000,
            gasPrice: 21000,
            value: 1000000000000000000
        },
        (err, result) => { 
            console.log("result=", result) 
            console.log("error=", err)
        }
    )
}
    
(async _ => {
    private_network() 
})()
