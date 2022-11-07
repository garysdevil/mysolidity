import * as ethers from 'ethers';
import { isTransactionAmountPackable } from 'zksync/build/utils.js';
import * as utils from '../utils/utils.js';

const initWallet = (provider, privateKey) => {
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
// sendTx(wallet, "地址", txRaw);
const sendTx = async (wallet, txRaw, waitFlag = true) => {
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
    // feeData = {
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

// const estimateGas = async (provider) => {

// }
// await provider.estimateGas({
//     // Wrapped ETH address
//     to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",

//     // `function deposit() payable`
//     data: "0xd0e30db0",

//     // 1 ether
//     value: parseEther("1.0")
//   });


const transferSimple = async (wallet, toAddress, valueEther, waitFlag = true) => {
    const txRaw = {
        to: toAddress,
        value: ethers.utils.parseEther(valueEther)
    };
    const jsonResult = await sendTx(wallet, txRaw, waitFlag);
    return jsonResult;
}


// 定制化交易手续费，轮训等待baseFee降低，默认间隔10秒
const transferExact = async (wallet, to_address, value_ether, waitFlag = true, maxFeePerGas_gwei = '10', maxPriorityFeePerGas_gwei = '1', intervalTime = 10000) => {
    const value = ethers.utils.parseEther(value_ether);
    const maxFeePerGas = ethers.utils.parseUnits(maxFeePerGas_gwei, "gwei");
    const maxPriorityFeePerGas = ethers.utils.parseUnits(maxPriorityFeePerGas_gwei, "gwei");

    // 签名发送交易 // 发送交易前先评估费用，否则可能会由于设置的gasPrice过低，导致交易失败
    const rawTx = {
        maxPriorityFeePerGas,
        maxFeePerGas,
        to: to_address,
        value
    };
    const jsonStr = await whileGasPrice(wallet.provider, maxFeePerGas_gwei, intervalTime);
    // JSON.parse(jsonStr).gasPrice
    // parseFloat(targetGasPrice);

    try{
        let jsonResult = await sendTx(wallet, rawTx, waitFlag);
        return jsonResult;
    }catch(e){
        console.log("gasPrice突然大于设定的值,等待" + intervalTime / 1000 + "秒后重试。\n", e);
        await transferExact(wallet, to_address, value_ether, waitFlag = true, maxFeePerGas_gwei = '10', maxPriorityFeePerGas_gwei = '1', intervalTime = 10000);
    }
}


// 传入参数
    // provider
    // targetGasPrice 单位为gwei，数字类型
    // intervalTime 默认5秒轮训一次
// 传出参数 { currentBlockGasPrice } 字符串
const whileGasPrice = async (provider, targetGasPrice, intervalTime = 5000) => {
    targetGasPrice = parseFloat(targetGasPrice);
    while (true) {
        const jsonStr = await getGasPrice(provider);
        const currentBlockGasPrice = parseFloat(JSON.parse(jsonStr).gasPrice);
        // const currentBlockGasPrice_obj = ethers.utils.parseUnits(currentBlockGasPrice, "gwei");

        console.log("currentBlockGasPrice = " + currentBlockGasPrice, "; targetGasPrice = ", targetGasPrice);

        // console.log(typeof parseFloat(currentBlockGasPrice));
        // console.log(typeof targetGasPrice);
        if (targetGasPrice > currentBlockGasPrice){
            return JSON.stringify({currentBlockGasPrice});
        }

        await utils.delay(intervalTime);
    }
}

export { sendTx, transferSimple, transferExact };
export { initWallet, getBalance, getGasPrice, getProviderStatus, whileGasPrice };

(async _ => {
    // await testCoinContract();
    // const ethersProvider = new ethers.providers.getDefaultProvider();
    // await whileGasPrice(ethersProvider, 44);

})()