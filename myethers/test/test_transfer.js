import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as ethers_online from '../ethers/ethers_online.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;
const wallet_address_a = config.wallet_address;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


// 定制化交易费
// 轮训等待baseFee降低
const myTransfer = async (ethWallet, to_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei = 0.1, intervalTime = 10000) => {
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
        console.log("currentBlockGasPrice= ", ethers.utils.formatUnits(currentBlockGasPrice, 'gwei'), "Gwei");

        if (maxFeePerGas.gt(currentBlockGasPrice)) {
            let jsonResult = await ethers_online.sendTx(rawTx, ethWallet, false);
            sentFlag = true;
            console.log("转账已经被广播进以太坊网络", jsonResult);
        } else {
            console.log("gasPrice大于设定的值,等待" + intervalTime / 1000 + "秒后重试。\n");
            await zksync.utils.sleep(intervalTime);
        }
    }
}



(async _ => {
    await ethers_online.getProviderStatus(ethersProvider);
    console.log(await ethers_online.getGasPrice(ethersProvider));

    // 以指定的gas价格发送一笔交易
    const value_ether = '0.01';
    const maxFeePerGas_gwei = '12';
    const maxPriorityFeePerGas_gwei = '0.1';
    const ethWallet = ethers_online.initWallet(wallet_private_key, ethersProvider);
    const to_address = wallet_address_a;
    console.log(await ethers_online.getBalance(to_address, ethersProvider));
    await myTransfer(ethWallet, wallet_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
    

    // 批量创建钱包
    // const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    // const data = fs.readFileSync('./local_wallet.json', 'utf8');
    // const data_arr_obj = JSON.parse(data);

    // 批量发送交易
    // const value_ether = '1';
    // const maxFeePerGas_gwei = '12';
    // const maxPriorityFeePerGas_gwei = '0.1';
    // await ethers_online.getBalance(to_address, ethersProvider);
    // for (let i =0; i < 10; i++){
    //     let to_address = data_arr_obj[i].address;
    //     console.log(i, "to_address=", to_address)
    //     await myTransfer(ethWallet, to_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
    //     await ethers_online.getBalance(to_address, ethersProvider);
    // }

})()