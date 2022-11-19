import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';
import * as utils from '../utils/utils.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;
const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

// 转出钱包的所有余额
const test_transferExact_all = async (origin_address, origin_private_key, to_address) => {
    // // 轮训直到gas价格小于目标值
    // const jsonStr = await ethers_online.loopGetTargetGasPrice(ethersProvider, maxFeePerGas_gwei, 15000);

    let maxFeePerGas_gwei = 11;
    const maxPriorityFeePerGas_gwei = '1';

    // 获取余额
    let result = await ethers_online.getBalance(ethersProvider, origin_address);
    const balance_ether_obj = ethers.utils.parseEther(JSON.parse(result).balance)

    const fee_gwei = 21000 * maxFeePerGas_gwei;
    maxFeePerGas_gwei = maxFeePerGas_gwei.toString();

    // 设置全部转出的余额
    const fee_ether_obj = ethers.utils.parseUnits(fee_gwei.toString(), "gwei");
    const transfer_ether_obj = balance_ether_obj.sub(fee_ether_obj);
    const value_ether = ethers.utils.formatEther(transfer_ether_obj).toString();
    console.log("可以全部转出的余额(ETH)=", value_ether, "maxFeePerGas_gwei=", maxFeePerGas_gwei);
    // 转出所有的余额
    const ethWallet = new ethers.Wallet(origin_private_key).connect(ethersProvider);
    const txFee = await ethers_online.transferExact(ethWallet, to_address, value_ether, false, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
    console.log("结果", txFee);
}

// 以指定的gas价格发送一笔交易
const test_transferExact = async () => {
    // const to_address = wallet_address_a;
    // const value_ether = '0.01';
    // const sentWait = true;
    // const maxFeePerGas_gwei = '12';
    // const maxPriorityFeePerGas_gwei = '0.1';
    // const ethWallet = ethers_online.initWallet(wallet_private_key, ethersProvider);
    // console.log(await ethers_online.getBalance(to_address, ethersProvider));
    // await ethers_online.transferExact(ethWallet, wallet_address, value_ether, sentWait, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
}

const batchTransfer = _ => {
    // 批量发送交易
    // const data = fs.readFileSync('./local_wallet.json', 'utf8');
    // const data_arr_obj = JSON.parse(data);
    // const value_ether = '1';
    // const maxFeePerGas_gwei = '12';
    // const maxPriorityFeePerGas_gwei = '0.1';
    // await ethers_online.getBalance(ethersProvider, to_address);
    // for (let i =0; i < 10; i++){
    //     let to_address = data_arr_obj[i].address;
    //     console.log(i, "to_address=", to_address)
    //     await myTransfer(ethWallet, to_address, value_ether, maxFeePerGas_gwei, maxPriorityFeePerGas_gwei);
    //     await ethers_online.getBalance(ethersProvider, to_address);
    // }
}


const checkBalance = async _ => {
    const data = fs.readFileSync('./.local_wallet.json', 'utf8');
    const data_arr_obj = JSON.parse(data);
    
    
    // 批量查余额
    let total_ether = 0;
    for (let i = 0; i < 10; i++){
        let to_address = data_arr_obj[i].address;
        const result = await ethers_online.getBalance(ethersProvider, to_address);
        const jsonObj = JSON.parse(result);
        jsonObj.seq = i;
        console.log(JSON.stringify(jsonObj));
        total_ether += parseFloat(jsonObj.balance);
    }
    console.log(total_ether, "ETH");
}


(async _ => {
    await ethers_online.getProviderStatus(ethersProvider);
    // console.log(await ethers_online.getGasPrice(ethersProvider));

    // await ethers_online.loopGetTargetGasPrice(ethersProvider, maxFeePerGas_gwei, 15000);
    // await test_transferExact_all(origin_address, origin_private_key, to_address);


})()