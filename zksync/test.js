import * as ethers from 'ethers';
import fs, { unwatchFile } from 'fs';
import ini from 'ini';

import * as utils_ethers from './utils_ethers.js';
import * as zksync_v1 from './zksync_v1.js';

const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.testnet_goerli.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;

const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


const test_zksync_1 = async _ => {
    // 存
    let ethTxHash = await zksync_v1.depositToSyncFromEthereum('0.005');
    console.log("1 ethTxHash", ethTxHash);
}

const test_zksync_2 = async _ => {
    // 激活账户
    let activeRecetp = await zksync_v1.activeAccount();
    console.log("2 activeRecetp", activeRecetp);

    // 转账
    let transferReceipt = await zksync_v1.transferETH(wallet_address_a, '0.0001');
    console.log("3 transferReceipt", transferReceipt);

    // 取
    let txHash = await zksync_v1.withdrawFromSyncToEthereum('0.001');
    console.log("4 txHash", txHash);

    // 获取余额
    zksync_v1.getBalance();
}

const test_ethers = async _ => {
    // 生成钱包
    let wallet_json_str = utils_ethers.generateEthWallet();
    console.log(wallet_json_str);
    const new_wallet_address = JSON.parse(wallet_json_str).address;
    // new_wallet_private_key = JSON.parse(wallet_json_str).private_key;

    // 转账
    const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    let txFeeETH = await utils_ethers.transferETH(new_wallet_address, "0.01", ethWallet);
    console.log(txFeeETH);

    // 查看余额
    await utils_ethers.getBalance(new_wallet_address, ethersProvider);

    return wallet_json_str;
}

(async _ => {
    console.log(ethereum_url);
    console.log(await ethersProvider.ready);
    console.log(await ethersProvider.getBlockNumber());
    console.log("连接正常");

    let new_wallet_json_str = await test_ethers();
    let new_wallet_obj = JSON.parse(new_wallet_json_str);
    console.log("完成以太坊链上操作");

    await zksync_v1.init(ethereum_url, 'goerli', new_wallet_obj.private_key);
    console.log(new_wallet_obj.private_key);
    await test_zksync_1();
    console.log("完成zksync链上操作1");

    // await zksync_v1.init(ethereum_url, 'goerli', new_wallet_obj.private_key);
    // console.log(new_wallet_obj.private_key);
    // await test_zksync_2();
    // console.log("完成zksync链上操作2");

})()

