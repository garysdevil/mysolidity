import * as ethers from 'ethers';

const initWallet = (privateKey, provider) => {
    // 方式一 通过助记词
    // const MNEMONIC = "";
    // const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

    // 方式二 通过私钥
    // const privateKey = "";
    const wallet = new ethers.Wallet(privateKey).connect(provider);
    console.log("ethers_online initWallet address=", wallet.address);

    return wallet;
}

const getProviderStatus = async (provider) => {
    console.log("====================");
    const status = await provider.ready;
    console.log("节点状态: ", status);
    const blockNum = await provider.getBlockNumber()
    console.log("节点块高: ", blockNum);
    console.log("====================\n");
}

// const txRaw = {
//     to: toAddress,
//     value: ethers.utils.parseEther('0.01')
// };
// const wallet = new ethers.Wallet(privateKey).connect(provider);
// sendTx("地址", txRaw, wallet);
const sendTx = async (txRaw, wallet, waitFlag = true) => {
    const txReceipt_1 = await wallet.sendTransaction(txRaw);
    const txHash = txReceipt_1.hash;
    console.log("txHash=", txHash);
    // 如果不等待交易被打包，则直接返回交易的哈希
    if (waitFlag == false) {
        return JSON.stringify({ txHash });
    }

    // 等待交易被打包
    let txReceipt_2 = await txReceipt_1.wait();
    // console.log(txReceipt_2);

    const blockNumber = txReceipt_2.blockNumber;
    const gasUsed = ethers.utils.formatUnits(txReceipt_2.gasUsed, 'wei');
    const effectiveGasPrice_Gwei = ethers.utils.formatUnits(txReceipt_2.effectiveGasPrice, 'gwei');

    const tx_fee = txReceipt_2.gasUsed.mul(txReceipt_2.effectiveGasPrice);
    const tx_fee_eth = ethers.utils.formatUnits(tx_fee, 'ether');

    return JSON.stringify({ blockNumber, gasUsed, effectiveGasPrice_Gwei, tx_fee_eth });
}

const sendSimpleTransferTx = async (toAddress, valueEther, wallet, waitFlag = true) => {
    const txRaw = {
        to: toAddress,
        value: ethers.utils.parseEther(valueEther)
    };
    const jsonResult = await sendTx(txRaw, wallet, waitFlag);
    return jsonResult;
}


// const address = '0x111';
// const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);
const getBalance = async (address, ethersProvider) => {
    const balance_bignum = await ethersProvider.getBalance(address);
    const balance = await ethers.utils.formatEther(balance_bignum);
    const unit = 'ether';
    // console.log(address, "=", balance_ether, "ETH");
    // return ethers.utils.formatUnits(balance_bignum, 'wei');
    return JSON.stringify({ balance, unit, address });
}

// const provider = new ethers.providers.JsonRpcProvider(ethereum_url);
const getGasPrice = async (provider) => {

    // Returns the current recommended FeeData to use in a transaction.
    const feeData = await provider.getFeeData()
    // {
    //   gasPrice: { BigNumber: "21971214174" },
    //   lastBaseFeePerGas: { BigNumber: "21761034090" },
    //   maxFeePerGas: { BigNumber: "45022068180" },
    //   maxPriorityFeePerGas: { BigNumber: "1500000000" }
    // }
    const maxFeePerGas = ethers.utils.formatUnits(feeData.maxFeePerGas, "gwei");
    const maxPriorityFeePerGas = ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei");
    const gasPrice = ethers.utils.formatUnits(feeData.gasPrice, "gwei");
    // const gasPrice = ethers.utils.formatUnits(await provider.getGasPrice(), "gwei");

    // console.log("gasPrice= " + gasPrice +  "Gwei");
    // console.log("maxFeePerGas_recommend= " + maxFeePerGas + " Gwei")
    // console.log("maxPriorityFeePerGas_recommend= " + maxPriorityFeePerGas + " Gwei");

    return JSON.stringify({ gasPrice, maxFeePerGas, maxPriorityFeePerGas });
}

// await provider.estimateGas({
//     // Wrapped ETH address
//     to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

//     // `function deposit() payable`
//     data: "0xd0e30db0",

//     // 1 ether
//     value: parseEther("1.0")
//   });



export { sendTx, sendSimpleTransferTx };
export { initWallet, getBalance, getGasPrice, getProviderStatus };
