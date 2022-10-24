import * as ethers from 'ethers';
import fs from 'fs';

// 生成一个钱包，返回钱包的地址，私钥，助记词
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

// 批量生成钱包，写入指定的文件内
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

export { generateEthWallet, generateEthWalletFor };