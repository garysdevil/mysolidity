import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as utils_ethers from '../ethers/ethers_online.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);


const gasPriceLoop = async _ => {
    // 轮训gasPrice
    while (true) {
        console.log(await ethersProvider.getBlockNumber());
        const jsonResult = await utils_ethers.getGasPrice(ethersProvider);
        // console.log(JSON.parse(jsonResult).gasPrice);
        console.log(JSON.parse(jsonResult));
        // 等待10秒
        await zksync.utils.sleep(10000);
    }
}

(async _ => {
    await gasPriceLoop();
})()

