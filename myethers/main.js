import * as ethers from 'ethers';
import fs, { unwatchFile } from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as ethers_online from './ethers/ethers_online';
import * as zksync_v1 from './zksync/zksync_v1.js';

const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;
// const ethereum_url = config.fullnode.ethereum_ws_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;

const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


const test_ethers = async _ => {
    // 转账
    const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    let txFeeETH = await ethers_online.transferETH(new_wallet_address, "0.01", ethWallet);
    console.log(txFeeETH);

    // 查看余额
    await ethers_online.getBalance(new_wallet_address, ethersProvider);

    return wallet_json_str;
}



(async _ => {
    // console.log(ethereum_url);
    // console.log(await ethersProvider.ready);
    // console.log(await ethersProvider.getBlockNumber());
    // console.log("连接正常");

    // const data = fs.readFileSync('./local_wallet.json', 'utf8');
    // const data_arr_obj = JSON.parse(data);
    // console.log("address",data_arr_obj[0].address)
    // console.log("private_key",data_arr_obj[0].private_key)

    // zksync_v1.init(ethereum_url, 'mainnet', wallet_private_key);

    ethers_online.generateEthWalletFor(50, 'local_company.json');

})()

