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

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


// 定制化交易费
// 轮训等待baseFee降低
const myTransfer = async (ethWallet, to_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei) => {
    const value = ethers.utils.parseEther(value_ether);
    const maxFeePerGas = ethers.utils.parseUnits(maxFeePerGas_gwei, "gwei");
    const maxPriorityFeePerGas = ethers.utils.parseUnits(maxPriorityFeePerGas_gwei, "gwei");

    // 签名发送交易 // 发送交易前先评估费用，否则可能会由于设置的gasPrice过低，导致交易失败
    const rawTx = {
        maxPriorityFeePerGas,
        maxFeePerGas,
        to: to_address,
        value
    };
    let sentFlag = false;
    while (!sentFlag) {
        const jsonStr = await ethers_online.getGasPrice(ethersProvider);
        let currentBlockGasPrice = JSON.parse(jsonStr).gasPrice;
        currentBlockGasPrice = ethers.utils.parseUnits(currentBlockGasPrice, "gwei");

        if (maxFeePerGas.gt(currentBlockGasPrice)) {
            let jsonResult = await ethers_online.sendTx(rawTx, ethWallet);
            sentFlag = true;
            console.log("currentBlockGasPrice= ", ethers.utils.formatUnits(currentBlockGasPrice, 'gwei'), "Gwei");
            console.log(jsonResult);
        } else {
            console.log("gasPrice大于设定的值,等待10秒后重试 currentBlockGasPrice= ", ethers.utils.formatUnits(currentBlockGasPrice, 'gwei'), "Gwei\n");
            await zksync.utils.sleep(10000);
        }
    }
}



(async _ => {
    console.log(ethereum_url);
    console.log(await ethersProvider.ready);
    console.log(await ethersProvider.getBlockNumber());
    console.log("连接正常");

    const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    const data = fs.readFileSync('./wallet.json', 'utf8');
    const data_arr_obj = JSON.parse(data);


    // const value_ether = '1';
    // const maxFeePerGas_gwei = '12';
    // const maxPriorityFeePerGas_gwei = '0.1';
    // for (let i =0; i < 10; i++){
    //     let to_address = data_arr_obj[i].address;
    //     console.log(i, "to_address=", to_address)
    //     // await myTransfer(ethWallet, to_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
    //     await ethers_online.getBalance(to_address, ethersProvider);
    // }

})()