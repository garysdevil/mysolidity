const fs = require('fs')
const ini = require('ini')

const { Web3, web3Obj, createAccount, getBalance, getBlockNumber, getAllEvent, signAndsendTransactionOldway, signTransaction, sendSignedTransaction, getGasPrice, getEstimateGas, evaluateTxFee } = require('./web3Rpc')

const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
const private_key = config.private_key

const create_transfer_tx = (to_address, ether) => {
    const value = web3Obj.utils.toWei(ether, "ether");
    console.log(value)
    const tx = {
        to: to_address,
        gas: 21000,
        value: value,
        data: '',
    };
    return tx
}
const create_transfer_tx_0x = (to_address, ether) => {
    const value = web3Obj.utils.toWei(ether, "ether");
    const tx = {
        to: to_address,
        gas: Web3.utils.toHex(21010),
        value: Web3.utils.toHex(value),
        data: Web3.utils.toHex(''),
    };
    return tx
}

const transfer_raw_tx = create_transfer_tx('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');
const transfer_raw_tx_0x = create_transfer_tx('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');


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


(async _ => {
    // console.log('\n getBlockNumber===========');
    // await getBlockNumber()
    
    // console.log('\n getGasPrice===========');
    // await getGasPrice()

    // console.log('\n createAccount===========');
    // await createAccount();

    // 测试失败
    // console.log('getBalance===========');
    // await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");

    // console.log('\n getEstimateGas===========');
    // await getEstimateGas(transfer_raw_tx);

    // console.log('\n evaluateTxFee===========');
    // await evaluateTxFee(transfer_raw_tx)

    // console.log('\n signAndsendTransactionOldway===========');
    // await signAndsendTransactionOldway(transfer_raw_tx, private_key);

    // console.log('\n signTransaction===========');
    // let signedTxStr = signTransaction(transfer_raw_tx_0x, private_key, 'goerli');
    // console.log(signedTxStr);

    // 测试失败
    // console.log('\n sendSignedTransaction===========');
    // sendSignedTransaction(signedTxStr);
})()
