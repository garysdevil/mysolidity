import * as ethers from 'ethers';
import fs, { unwatchFile } from 'fs';
import ini from 'ini';
import * as zksync from 'zksync';

import * as utils_ethers from './utils_ethers.js';

const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.mainnet.ethereum_rpc_url;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

(async _ => {
    // 轮训gasPrice
    while (true) {
        console.log(await ethersProvider.getBlockNumber());
        await utils_ethers.getGasPrice(ethersProvider);
        // 等待10秒
        await zksync.utils.sleep(10000);
        console.log();
    }
})()

