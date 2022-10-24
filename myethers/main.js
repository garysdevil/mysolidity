import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as ethers_online from './ethers/ethers_online.js';
import * as zksync_v1 from './zksync/zksync_v1.js';

const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;

const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


// 定制化交易费
// 轮训等待baseFee降低
const myTransfer = async (to_address, ethWallet) => {
    const value_ether = '0.01';
    const maxFeePerGas = ethers.utils.parseUnits('78', "gwei");
    const maxPriorityFeePerGas = ethers.utils.parseUnits('0.1', "gwei");
    
    // 签名发送交易 // 发送交易前先评估费用，否则可能会由于设置的gasPrice过低，导致交易失败
    const rawTx = {
        maxPriorityFeePerGas,
        maxFeePerGas,
        to: to_address,
        value: ethers.utils.parseEther(value_ether)
    };
    let sendFlag = false;
    while (!sendFlag){
        const jsonStr = await ethers_online.getGasPrice(ethersProvider);
        let currentGasPrice = JSON.parse(jsonStr).gasPrice;
        currentGasPrice = ethers.utils.parseUnits(currentGasPrice, "gwei");
    
        if (maxFeePerGas.gt(currentGasPrice)){
            let jsonResult = await ethers_online.sendTx(rawTx, ethWallet);
            sendFlag = true;
            console.log(jsonResult);
        }else{
            console.log("gasPrice大于设定的值,等待10秒后重试 currentGasPrice= ", ethers.utils.formatUnits(currentGasPrice, 'gwei'), "Gwei\n");
            await zksync.utils.sleep(10000);
        }
    }
    await ethers_online.getBalance(to_address, ethersProvider);
    
}



(async _ => {
    console.log(ethereum_url);
    console.log(await ethersProvider.ready);
    console.log(await ethersProvider.getBlockNumber());
    console.log("连接正常");

    const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);

    await myTransfer(wallet_address_a, ethWallet);

})()

