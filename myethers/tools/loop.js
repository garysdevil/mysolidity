import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as ethers_online from '../ethers/ethers_online.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


const loopNetGasPrice = async _ => {
    // 轮训gasPrice
    while (true) {
        console.log(await ethersProvider.getBlockNumber());
        const jsonResult = await ethers_online.getNetGasPrice(ethersProvider);
        // console.log(JSON.parse(jsonResult).gasPrice);
        console.log(JSON.parse(jsonResult));
        // 等待14秒
        await zksync.utils.sleep(14000);
    }
}

(async _ => {
    await loopNetGasPrice();
})()

