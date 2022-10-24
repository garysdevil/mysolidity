import * as ethers from 'ethers';
import fs from 'fs';

const generateEthWallet = _ => {
    // 生成钱包 方式一
    // let privateKey = ethers.utils.randomBytes(32) // 生成32个随机字节
    // // console.log(Buffer.from(privateKey).toString('hex')) // 转成16进制字符串
    // let wallet = new ethers.Wallet(privateKey)

    // 生成钱包 方式二
    let wallet = ethers.Wallet.createRandom();

    // 返回钱包地址和私钥
    let address = wallet.address;
    let private_key = wallet.privateKey;
    let mnemonic = wallet.mnemonic;
    // let mnemonic = wallet.mnemonic.phrase
    let json = JSON.stringify({ address, private_key, mnemonic });
    console.log(wallet);
    // console.log(json);
    return json;
}

const connectEthWallet = (privateKey, provider) => {
    // 方式一 通过助记词
    // const MNEMONIC = "";
    // const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

    // 方式二 通过私钥
    // const privateKey = "";
    const wallet = new ethers.Wallet(privateKey).connect(provider);

    return wallet;
}

// const wallet = new ethers.Wallet(privateKey).connect(provider);
// transferETH("", "0.1", wallet);
const transferETH = async (toAddress, valueEther, wallet, wait_flag = true) => {
    const tx_raw = {
        to: toAddress,
        value: ethers.utils.parseEther(valueEther)
    };

    const txReceipt_1 = await wallet.sendTransaction(tx_raw);
    const txHash = txReceipt_1.hash;
    console.log("transferETH_Hash", txHash);

    // 如果不等待交易被打包，则直接返回交易的哈希
    if (wait_flag == false) {
        return JSON.stringify({ txHash });
    }

    // 等待交易被打包
    let txReceipt_2 = await txReceipt_1.wait();
    // console.log(txReceipt_2);

    const gasUsed = ethers.utils.formatUnits(txReceipt_2.gasUsed, 'wei');
    const effectiveGasPrice_Gwei = ethers.utils.formatUnits(txReceipt_2.effectiveGasPrice, 'gwei');

    const tx_fee = txReceipt_2.gasUsed.mul(txReceipt_2.effectiveGasPrice);
    const tx_fee_eth = ethers.utils.formatUnits(tx_fee, 'ether');

    return JSON.stringify({ gasUsed, effectiveGasPrice_Gwei, tx_fee_eth });
}

const getBalance = async (walletAddress, ethersProvider) => {
    const balance_bignum = await ethersProvider.getBalance(walletAddress);
    let balance_ether = await ethers.utils.formatEther(balance_bignum);
    console.log(walletAddress, "=", balance_ether, "ETH");
    return ethers.utils.formatUnits(balance_bignum, 'wei');
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

    console.log("gasPrice= " + gasPrice +  "Gwei");
    console.log("maxFeePerGas_recommend= " + maxFeePerGas + " Gwei")
    console.log("maxPriorityFeePerGas_recommend= " + maxPriorityFeePerGas + " Gwei");

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


const generateEthWalletFor =  (num, path) => {
    fs.writeFileSync(path, '[\n');
    for (let i = 0; i < num; i++) {
        let wallet_json_str = generateEthWallet();
        // console.log(wallet_json_str);
        fs.appendFileSync(path, wallet_json_str);
        if ( i < num - 1 ){
            fs.appendFileSync(path, ',\n');
        }
    }
    fs.appendFileSync(path, '\n]');
}


export { generateEthWallet, connectEthWallet, transferETH, getBalance, getGasPrice };

export { generateEthWalletFor };