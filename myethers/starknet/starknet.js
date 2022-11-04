import fs from "fs";
// import {
//   Account,
//   Contract,
//   defaultProvider,
//   ec,
//   json,
//   number
// } from "starknet";

import * as starknet from 'starknet';

import readline from "readline";

const getProvider = (network = 'goerli-alpha') => {
    // 官方默认的接口
    const provider = new starknet.Provider({
        sequencer: {
            network: network //  'goerli-alpha' or 'mainnet-alpha'
        }
    })

    // Sequencer节点接口
    // const provider = new starknet.SequencerProvider({
    //     baseUrl: 'https://alpha4.starknet.io',
    //     feederGatewayUrl: 'feeder_gateway',
    //     gatewayUrl: 'gateway',
    // })
    // const provider = process.env.STARKNET_PROVIDER_BASE_URL === undefined ? starknet.defaultProvider : new starknet.Provider({ baseUrl: process.env.STARKNET_PROVIDER_BASE_URL });

    // RPC接口
    // const provider = new starknet.RpcProvider({
    //     nodeUrl: 'URL_TO_STARKNET_RPC_NODE',
    // })

    return provider;
}


// 通过私钥创建 starknet的合约账户
// const provider = starknet.defaultProvider;
// const privateKey = starknet.stark.randomAddress();
const createContractAccount = async (provider, privateKey, waitDoneFlag = false) => {
    const starkKeyPair = starknet.ec.genKeyPair(privateKey);
    const starkKeyPub = starknet.ec.getStarkKey(starkKeyPair);

    console.log("\nReading OpenZeppelin Account Contract...");
    const compiledOZAccount = starknet.json.parse(
        fs.readFileSync("./OZAccount.json").toString("ascii")
    );
    // 部署合约账户，广播交易
    console.log("Deployment Tx - Account Contract to StarkNet...");
    const accountResponse = await provider.deployContract({
        contract: compiledOZAccount,
        constructorCalldata: [starkKeyPub],
        addressSalt: starkKeyPub,
    });
    const contractAccount = accountResponse.contract_address;
    console.log("starknet网络交易哈希", accountResponse.transaction_hash);

    if (waitDoneFlag) {
        // 部署合约账户，等待交易完成
        console.log("Waiting for Tx to be Accepted on Starknet - OpenZeppelin Account Deployment...");
        const result = await provider.waitForTransaction(accountResponse.transaction_hash);
        console.log(result);
    }
    return JSON.stringify({ contractAccount });
}

(async _ => {

    const privateKey = starknet.stark.randomAddress(); // 随机创建私钥
    const provider = getProvider(privateKey);
    console.log(provider);
    const contractAccount = await createContractAccount(provider, '');
    console.log(contractAccount);

})()