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





(async _ => {
    console.log("Hello World");

    // 批量创建钱包
    // const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    // const data = fs.readFileSync('./wallet.json', 'utf8');
    // const data_arr_obj = JSON.parse(data);

})()