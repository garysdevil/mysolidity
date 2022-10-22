const fs = require('fs')
const ini = require('ini')
const path = require('path')
const Web3Utils = require('web3-utils');

const web3RPCPath = path.join(__dirname, "../service/web3RPC");
const { createAccount, getBalance, getAcountNonce, getBlockNumber, getContractInstance, getEstimatedTxFee, getAllEvent, getEstimatedGas, getGasPrice } = require(web3RPCPath)
const { signTransaction, sendSignedTransaction } = require(web3RPCPath)

const confPath = path.join(__dirname, "../conf/.local.config.ini");
const config = ini.parse(fs.readFileSync(confPath, 'utf-8'));
const walletPrivateKey = config.wallet_private_key;
const walletAddress = config.wallet_address;
const walletAddressA = config.wallet_address_a;

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
    await getBalance(walletAddress);
    const abiPath = path.join(__dirname, "./coinABI.json");
    let conObj = await getContractInstance(abiPath, '0xEEF78C80a98B3410260711f27Ab650043478Ad80');
    let data = conObj.methods.mint(walletAddress, 10).encodeABI();
    const rawTx = {
        // nonce: 75,
        to: '0xEEF78C80a98B3410260711f27Ab650043478Ad80',
        maxPriorityFeePerGas: Web3Utils.toWei('4', "Gwei"),
        // maxFeePerGas: Web3Utils.toWei('5', "Gwei"),
        gas: 7790298,
        data
    };
    // rawTx.gas = await getEstimatedGas(rawTx);
    let signedTx = await signTransaction(rawTx, walletPrivateKey);
    await getEstimatedGas(signedTx);
    let receipt = await sendSignedTransaction(signedTx);
    // console.log(receipt);
    await getBalance(walletAddress);
    conObj.methods.balances(walletAddress).call({ from: walletAddress }, (err, result) => {
        if (err) {
            console.log("conObj.methods.balances", err)
        } else {
            console.log(result);
        }
    });
}

const test = async _ => {
    const transfer_raw_tx = create_transfer_tx(walletAddressA, '0.001');
    const transfer_raw_tx_0x = create_transfer_tx_0x(walletAddressA, '0.001');
    const transfer_raw_tx_exact = create_transfer_tx_exact(64, walletAddressA, '0.001', '30');
    const transfer_raw_tx_1559 = create_transfer_tx_1559(walletAddressA, '0.001', '50', '10');
    const rawTx = transfer_raw_tx_1559;

    console.log('\n getBlockNumber===========');
    await getBlockNumber()

    console.log('\n createAccount===========');
    await createAccount();

    console.log('\ngetBalance===========');
    await getBalance(walletAddress);

    console.log('\n getGasPrice===========');
    await getGasPrice()

    console.log('\n getEstimatedGas===========');
    await getEstimatedGas(rawTx);

    console.log('\n getEstimatedTxFee===========');
    await getEstimatedTxFee(rawTx)

    console.log('\n getAcountNonce===========');
    nonceObj = await getAcountNonce(walletAddress);
    console.log(nonceObj);

    console.log('\n signTransaction===========');
    let signedTx = await signTransaction(rawTx, walletPrivateKey);

    console.log('\n sendSignedTransaction===========');
    let receipt = await sendSignedTransaction(signedTx);
    // console.log(receipt);

    console.log('\n getContractInstance===========');
    await testGetContractInstance();
}

(async _ => {
    await test();
})()
