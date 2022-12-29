import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;
const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

const abi = [
    "function claimRank(uint256 term)",
    "function getCurrentMaxTerm() view returns (uint)"
];

const xenMainnetAddress = "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8";
const xenTestnetAddress = "0x1E74E69B25c713a6908081727F0b4C2b8d38D766";

const xenContract = new ethers.Contract(xenTestnetAddress, abi, ethersProvider);

const getCurrentMaxTerm = async _ => {

    const oneDaySecond_big = ethers.BigNumber.from("86400");
    const maxSecond_obj = await xenContract.getCurrentMaxTerm(); // 目前最大可以设置的时间(秒)
    const currentMaxTerm = maxSecond_obj.div(oneDaySecond_big).toString();
    console.log("CurrentMaxTerm=", currentMaxTerm, "day");
    return currentMaxTerm;
}

const mint = async (walletAddress, walletPrivateKey, term_day, recommendGasPrice="11") => {

    // 获取这个钱包成功交易的nonce值+1
    // console.log("wallet nonce+1=", await ethersProvider.getTransactionCount(walletAddress)); 

    const wallet = ethers_online.initWallet(ethersProvider, walletPrivateKey);
    const xenWithSigner = xenContract.connect(wallet);

    // // 评估 gas 值
    // const estimateGas = await xenWithSigner.estimateGas.claimRank(term_day);
    // console.log("estimateGas:", estimateGas.toNumber());
    const estimateGas = ethers.BigNumber.from("179976");

    // 自定义参数
    let overrides = {
        gasLimit: estimateGas,
        maxFeePerGas: ethers.utils.parseUnits(recommendGasPrice, 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'),
        nonce: (await ethersProvider.getTransactionCount(walletAddress))
    };
    const tx = await xenWithSigner.claimRank(term_day, overrides);

    // const tx = await xenWithSigner.claimRank(term_day);
    console.log("hash=", tx.hash);
    // const receipt = await tx.wait();
    // console.log(receipt)
}

(async _ => {
    // await getCurrentMaxTerm();


    const term_day = 321;
    const data = fs.readFileSync('./.local_wallet.json', 'utf8');
    const data_arr_obj = JSON.parse(data);
    const recommendGasPrice = await ethers_online.loopGetTargetGasPrice(ethersProvider, 13, 15000);
    for (let i = 0; i < 10; i++){
        let wallet_address = data_arr_obj[i].address;
        let wallet_private_key = data_arr_obj[i].private_key;
        await mint(wallet_address, wallet_private_key, term_day, recommendGasPrice.toString());
    }    
})()

// gasFee = 179976 * gwei * 0.000000001
// gasFee = 179976 * 13 * 0.000000001 = 0.002339688
// gasFee = 179976 * 11 * 0.000000001 = 0.001979736