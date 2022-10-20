const signTransaction2 = (rawTx, privateKey, network) => {
    // const { Chain, Common, Hardfork } = require('@ethereumjs/common');
    const Tx = require('@ethereumjs/tx').Transaction;
    const bufferToHex = require('ethereumjs-util').bufferToHex;
    // const tx = Transaction.fromTxData(rawTx, { common })

    let tx = new Tx(rawTx, { chain: 'Goerli' });

    let private_key_byte = Buffer.from(privateKey, 'hex');
    let signedTx = tx.sign(private_key_byte); // 使用require('@ethereumjs/tx').Transaction进行签名的tx，tx里面的信息必须都是16进制的。

    if (signedTx.validate() && bufferToHex(signedTx.getSenderAddress()) === '0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D') {
        console.log('Correctly created the tx')
    } else {
        console.error('Invalid tx')
    }

    let serializedTx = signedTx.serialize();
    let signedTxStr = '0x' + serializedTx.toString('hex');

    return signedTxStr;
}

const sendSignedTransaction2 = async (signedTransaction) => {
    // web3Obj.eth.sendSignedTransaction(signedTransaction).on('receipt', console.log);
    // 广播交易
    web3Obj.eth.sendSignedTransaction(signedTransaction, (err, txHash) => {
        if (!err) {
            hash = txHash
            console.log("success:" + txHash)
            return hash
        } else {
            console.log(err);
        }
    })
}

// console.log('\n signTransaction2===========');
// let signedTxStr = signTransaction2(transfer_raw_tx_0x, private_key, 'goerli');
// console.log(signedTxStr);

// // 测试失败
// console.log('\n sendSignedTransactio2===========');
// sendSignedTransaction2(signedTxStr);