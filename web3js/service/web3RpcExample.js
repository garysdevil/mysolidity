const fs = require('fs')
const ini = require('ini')
const path = require('path')
const Web3Utils = require('web3-utils');

const { createAccount, getBalance, getAcountNonce, getBlockNumber, getContractInstance, getEstimatedTxFee, getAllEvent, getEstimatedGas, getGasPrice } = require('./web3RPC')
const { signTransaction, sendSignedTransaction } = require('./web3RPC')

const conf_path = path.join(__dirname, "../conf/.local.config.ini");
const config = ini.parse(fs.readFileSync(conf_path, 'utf-8'))
const private_key = config.private_key

const create_transfer_tx = (to_address, value_ETH) => {
    const value = Web3Utils.toWei(value_ETH, "ether");
    const tx = {
        to: to_address,
        gas: 21000,
        value: value,
        data: '',
    };
    return tx
}

const create_transfer_tx_exact = (nonce, to_address, value_ETH, gasPrice_Gwei) => {
    const value = Web3Utils.toWei(value_ETH, "ether");
    const gasPrice = Web3Utils.toWei(gasPrice_Gwei, "Gwei");
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
    const value = Web3Utils.toWei(value_ETH, "ether");
    const maxFeePerGas = Web3Utils.toWei(maxFeePerGas_Gwei, "Gwei");
    const maxPriorityFeePerGas = Web3Utils.toWei(maxPriorityFeePerGas_Gwei, "Gwei");
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
    const value = Web3Utils.toWei(value_ETH, "ether");
    const tx = {
        to: to_address,
        gas: Web3Utils.toHex(22000),
        value: Web3Utils.toHex(value),
        data: Web3Utils.toHex(''),
    };
    return tx
}

const testGetContractInstance = async _ => {
    await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
    let conObj = await getContractInstance('./local_abi/coin.json', '0x788231cd5d968b11033630f3478049d5e0f40aa0');
    let data = conObj.methods.mint('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D', 10).encodeABI();
    const rawTx = {
        // nonce: 75,
        to: '0x788231cd5d968b11033630f3478049d5e0f40aa0',
        maxPriorityFeePerGas: Web3Utils.toWei('4', "Gwei"),
        // maxFeePerGas: Web3Utils.toWei('5', "Gwei"),
        gas: 7790298,
        data
    };
    // rawTx.gas = await getEstimatedGas(rawTx);
    let signedTx = await signTransaction(rawTx, private_key);
    await getEstimatedGas(signedTx);
    let receipt = await sendSignedTransaction(signedTx);
    // console.log(receipt);
    await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
    conObj.methods.balances("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D").call({ from: '0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D' }, (err, result) => {
        if (err) {
            console.log("conObj.methods.balances", err)
        } else {
            console.log(result);
        }
    });
}

const test = async _ => {
    const transfer_raw_tx = create_transfer_tx('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');
    const transfer_raw_tx_0x = create_transfer_tx_0x('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001');
    const transfer_raw_tx_exact = create_transfer_tx_exact(64, '0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001', '30');
    const transfer_raw_tx_1559 = create_transfer_tx_1559('0x1d3cD178C1c76fD903431efFD1B96F2022723c2a', '0.001', '50', '10');
    const rawTx = transfer_raw_tx_1559;

    console.log('\n getBlockNumber===========');
    await getBlockNumber()

    console.log('\n createAccount===========');
    await createAccount();

    console.log('\ngetBalance===========');
    await getBalance("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");

    console.log('\n getGasPrice===========');
    await getGasPrice()

    console.log('\n getEstimatedGas===========');
    await getEstimatedGas(rawTx);

    console.log('\n getEstimatedTxFee===========');
    await getEstimatedTxFee(rawTx)

    console.log('\n getAcountNonce===========');
    nonceObj = await getAcountNonce("0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D");
    console.log(nonceObj);

    console.log('\n signTransaction===========');
    let signedTx = await signTransaction(rawTx, private_key);

    console.log('\n sendSignedTransaction===========');
    let receipt = await sendSignedTransaction(signedTx);
    // console.log(receipt);

    console.log('\n getContractInstance===========');
    await testGetContractInstance();
}

(async _ => {
    await test();
})()
