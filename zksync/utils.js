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

export { generateEthWallet, connectEthWallet };