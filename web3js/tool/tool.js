// 例子
const keystoreExample = _ => {
    // 通过keystore解密出私钥
    keystoreJsonV3 = { "address": "907cc33c0b606f75836b6818beff2a926645b9ba", "crypto": { "cipher": "aes-128-ctr", "ciphertext": "704ac767d5e8eee15719095941ce81f16a7bca11e500e5b44ba9044f08fcc8d4", "cipherparams": { "iv": "3986def9537641a6e39f13cfe95a9ecd" }, "kdf": "scrypt", "kdfparams": { "dklen": 32, "n": 4096, "p": 6, "r": 8, "salt": "74f2d73f157386f0623d6dd957b4f777d08a608ec8e854bb04549520bc6deb96" }, "mac": "a049bec1d55115b830233f4861428c9c7874dbde575e8944b6d0892de8fd5040" }, "id": "91a56a11-6259-4a2c-b77e-06f57ba81381", "version": 3 }
    console.log(Web3Utils.eth.accounts.decrypt(keystoreJsonV3, '密码'));

    // 通过私钥生成keystore
    let privateKey = '0x3ecd8ed343b61c028e612eb9f7149e2d88df51719c4ef7acf787b68a4f2bd44e'
    password = '123456'
    console.log(Web3Utils.eth.accounts.encrypt(privateKey, password));
}