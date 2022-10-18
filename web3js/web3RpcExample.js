const fs = require('fs')
const ini = require('ini')

const { Web3, web3Obj, createAccount, getBalance, getAcountNonce, getBlockNumber, getAllEvent, signAndsendTransactionOldway, signTransaction, sendSignedTransaction, signTransaction2, sendSignedTransaction2, getGasPrice, getEstimateGas, evaluateTxFee, getContractInstance } = require('./web3Rpc')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const private_key = config.private_key

const create_transfer_tx = (to_address, value_ETH) => {
    const value = web3Obj.utils.toWei(value_ETH, "ether");
    const tx = {
        to: to_address,
        gas: 21000,
        value: value,
        data: '',
    };
    return tx
}

const create_exact_transfer_tx = (nonce, to_address, value_ETH, gasPrice_Gwei) => {
    const value = web3Obj.utils.toWei(value_ETH, "ether");
    const gasPrice = web3Obj.utils.toWei(gasPrice_Gwei, "Gwei");
    const tx = {
        nonce: nonce,
        to: to_address,
        gas: 21000,
        getGasPrice: gasPrice,
        value: value,
        data: '',
    };
    return tx
}


const create_transfer_tx_1559 = (to_address, value_ETH, maxFeePerGas_Gwei, maxPriorityFeePerGas_Gwei) => {
    const value = web3Obj.utils.toWei(value_ETH, "ether");
    const maxFeePerGas = web3Obj.utils.toWei(maxFeePerGas_Gwei, "Gwei");
    const maxPriorityFeePerGas = web3Obj.utils.toWei(maxPriorityFeePerGas_Gwei, "Gwei");
    const tx = {
        to: to_address,
        maxFeePerGas,
        maxPriorityFeePerGas,
        gas: 21000,
        value: value,
        data: '',
    };
    return tx
}

const create_transfer_tx_0x = (to_address, value_ETH) => {
    const value = web3Obj.utils.toWei(value_ETH, "ether");
    const tx = {
        to: to_address,
        gas: Web3.utils.toHex(22000),
        value: Web3.utils.toHex(value),
        data: Web3.utils.toHex(''),
    };
    return tx
}


// 例子
const keystoreExample = _ => {
    // 通过keystore解密出私钥
    keystoreJsonV3 = { "address": "907cc33c0b606f75836b6818beff2a926645b9ba", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "704ac767d5e8eee15719095941ce81f16a7bca11e500e5b44ba9044f08fcc8d4", "cipherparams": { "iv": "3986def9537641a6e39f13cfe95a9ecd" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 4096, "p": 6, "r": 8, "salt": "74f2d73f157386f0623d6dd957b4f777d08a608ec8e854bb04549520bc6deb96" }, "mac": "a049bec1d55115b830233f4861428c9c7874dbde575e8944b6d0892de8fd5040" }, "id": "91a56a11-6259-4a2c-b77e-06f57ba81381", "version": 3 }
    console.log(web3Obj.eth.accounts.decrypt(keystoreJsonV3, '密码'));

    // 通过私钥生成keystore
    let privateKey = '0x3ecd8ed343b61c028e612eb9f7149e2d88df51719c4ef7acf787b68a4f2bd44e'
    password = '123456'
    console.log(web3Obj.eth.accounts.encrypt(privateKey, password));
}

const testContract = async _ => {
    await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
    let conObj = await getContractInstance('./local_abi/coin.json', '0x788231cd5d968b11033630f3478049d5e0f40aa0');
    let data = conObj.methods.mint('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D', 10).encodeABI();
    const tx = {
        // nonce: 75,
        to: '0x788231cd5d968b11033630f3478049d5e0f40aa0',
        maxPriorityFeePerGas: web3Obj.utils.toWei('4', "Gwei"),
        // maxFeePerGas: web3Obj.utils.toWei('5', "Gwei"),
        gas: 7790298, // await getEstimateGas(tx);
        data
    };
    let signedTx = await signTransaction(tx, private_key);
    let receipt = await sendSignedTransaction(signedTx);
    console.log(receipt, "ETH");
    await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
}

(async _ => {
    const transfer_raw_tx = create_transfer_tx('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');
    const transfer_raw_tx_0x = create_transfer_tx_0x('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');
    const transfer_raw_tx_2 = create_exact_transfer_tx(64, '0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001', '30');
    const transfer_raw_tx_1559 = create_transfer_tx_1559('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001', '20', '20');
    const raw_tx = transfer_raw_tx_1559;

    // console.log('\n createAccount===========');
    // await createAccount();

    console.log('\n getBlockNumber===========');
    await getBlockNumber()
    
    // console.log('getBalance===========');
    // await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");

    // console.log('\n getGasPrice===========');
    // await getGasPrice()

    // console.log('\n getEstimateGas===========');
    // await getEstimateGas(raw_tx);

    // console.log('\n evaluateTxFee===========');
    // await evaluateTxFee(raw_tx)
    
    // console.log('\n getAcountNonce===========');
    // nonceObj = await getAcountNonce("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
    // console.log(nonceObj);

    // console.log('\n signTransaction===========');
    // console.log(raw_tx);
    // let signedTx = await signTransaction(raw_tx, private_key);
    // console.log(signedTx);
   
    // console.log('\n sendSignedTransaction===========');
    // let receipt = await sendSignedTransaction(signedTx);
    // console.log(receipt, "ETH");

    // console.log('\n signTransaction2===========');
    // let signedTxStr = signTransaction2(transfer_raw_tx_0x, private_key, 'goerli');
    // console.log(signedTxStr);

    // // 测试失败
    // console.log('\n sendSignedTransactio2===========');
    // sendSignedTransaction2(signedTxStr);

    console.log('\n getContractInstance===========');
    await testContract();

})()
