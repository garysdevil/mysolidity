import * as ethers from 'ethers';
import fs, { unwatchFile } from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as utils_ethers from './utils_ethers.js';
import * as zksync_v1 from './zksync_v1.js';

const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.testnet_goerli.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;

const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


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

const create_wallet =  _ => {
    fs.writeFileSync('./local_wallet.json', '[\n');
    for (let i = 0; i < 100; i++) {
        let wallet_json_str = utils_ethers.generateEthWallet();
        // console.log(wallet_json_str);
        fs.appendFileSync('./local_wallet.json', wallet_json_str);
        if ( i < 99 ){
            fs.appendFileSync('./local_wallet.json', ',\n');
        }
    }
    fs.appendFileSync('./local_wallet.json', '\n]');
}

(async _ => {
    // console.log(ethereum_url);
    // console.log(await ethersProvider.ready);
    // console.log(await ethersProvider.getBlockNumber());
    // console.log("连接正常");

    const data = fs.readFileSync('./local_wallet.json', 'utf8');
    const data_arr_obj = JSON.parse(data);
    console.log("address",data_arr_obj[0].address)
    console.log("private_key",data_arr_obj[0].private_key)

})()

