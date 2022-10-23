import * as ethers from 'ethers';

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
    // let mnemonic = wallet.mnemonic.phrase
    let json = JSON.stringify({ address, private_key });
    // console.log(json);
    return json;
}

const connectEthWallet = privateKey => {
    // 方式一 通过助记词
    // const MNEMONIC = "";
    // const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(ethersProvider);

    // 方式二 通过私钥
    // const privateKey = "";
    const wallet = new ethers.Wallet(privateKey);

    return wallet;
}

// const wallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
// transferETH("", "0.1", wallet);
const transferETH = async (to_address, value_ETH, wallet) => {
    const tx_raw = {
        to: to_address,
        value: ethers.utils.parseEther(value_ETH)
    };

    const txReceipt_1 = await wallet.sendTransaction(tx_raw);
    console.log("transferETH_Hash", txReceipt_1.hash);

    // 等待交易被打包
    let txReceipt_2 = await txReceipt_1.wait();
    // console.log(txReceipt_2);

    const gasUsed = ethers.utils.formatUnits(txReceipt_2.gasUsed, 'wei');
    const effectiveGasPrice_Gwei = ethers.utils.formatUnits(txReceipt_2.effectiveGasPrice, 'gwei');

    const tx_fee = txReceipt_2.gasUsed.mul(txReceipt_2.effectiveGasPrice);
    const tx_fee_eth = ethers.utils.formatUnits(tx_fee, 'ether');

    return JSON.stringify({ gasUsed, effectiveGasPrice_Gwei, tx_fee_eth });
}

const getBalance = async (wallet_address, ethersProvider) => {
    const balance_bignum = await ethersProvider.getBalance(wallet_address);
    let balance_eth = await ethers.utils.formatEther(balance_bignum);
    console.log(wallet_address, "=", balance_eth, "ETH");
    return ethers.utils.formatUnits(balance_bignum, 'wei');
}

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

    const gasPrice = ethers.utils.formatUnits(await provider.getGasPrice(), "gwei");

    console.log("gasPrice=" + gasPrice + "Gwei");
    console.log("maxFeePerGas_recommend=" + maxFeePerGas + " Gwei")
    console.log("maxPriorityFeePerGas_recommend=" + maxPriorityFeePerGas + " Gwei");
}

// await provider.estimateGas({
//     // Wrapped ETH address
//     to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  
//     // `function deposit() payable`
//     data: "0xd0e30db0",
  
//     // 1 ether
//     value: parseEther("1.0")
//   });

export { generateEthWallet, connectEthWallet, transferETH, getBalance, getGasPrice };