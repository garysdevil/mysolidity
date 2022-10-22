import * as zksync from 'zksync';
import * as ethers from 'ethers';
import path from 'path';
import fs from 'fs';
import ini from 'ini';

// import * as utils from './utils.js';
// import './utils.js';

// const conf_path = path.join(__dirname, "./conf/.local.config.ini");
// const config = ini.parse(fs.readFileSync(conf_path, 'utf-8'));
const config = ini.parse(fs.readFileSync("./conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.node.rpc_url;
const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;

// // 和zkSync网络交互
const syncProvider = await zksync.getDefaultProvider('goerli');
// const syncProvider = await zksync.getDefaultProvider('mainnet');

// 和以太坊网络交互
// const ethersProvider = ethers.getDefaultProvider('mainnet');
const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

const ethWallet = new ethers.Wallet(wallet_private_key);
const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);


// 充值进zkSync 二层网络
// 输入 以太坊代币 '0,1'
const depositToSyncFromEthereum = async (value_ETH) => {
    console.log(syncWallet.address());
    const deposit = await syncWallet.depositToSyncFromEthereum({
        depositTo: syncWallet.address(),
        token: 'ETH',
        amount: ethers.utils.parseEther(value_ETH)
    });

    // Await processing of the deposit on L1
    const ethereumTxReceipt = await deposit.waitL1Commit();
    console.log("ethereumTxReceipt", ethereumTxReceipt);

    // Await processing the deposit on zkSync
    const depositReceipt = await deposit.wait();
    console.log("depositReceipt", depositReceipt);

    // Retreiving the current (committed) balance of an account
    const committedEthBalance = await syncWallet.getBalance(zksync.utils.ETH_ADDRESS);
    console.log(committedEthBalance);
    // return committedEthBalance;
}

// 取回代币进Ethereum网络
const withdrawFromSyncToEthereum = async (value_ETH) => {
    const withdraw = await syncWallet.withdrawFromSyncToEthereum({
        ethAddress: ethWallet.address,
        token: 'ETH',
        amount: ethers.utils.parseEther(value_ETH)
    });
    // console.log(withdraw);
    // console.log(withdraw.txHash);
    return withdraw.txHash;

    // 等待被验证，耗时较长
    // const receipt = await withdraw.awaitVerifyReceipt();
    // return receipt;
}

// 转账
const transferETH = async (to_address, value_ETH) => {
    const amount = zksync.utils.closestPackableTransactionAmount(ethers.utils.parseEther(value_ETH));
    // const fee = zksync.utils.closestPackableTransactionFee(ethers.utils.parseEther('0.0001'));

    const transfer = await syncWallet.syncTransfer({
        to: to_address,
        token: 'ETH',
        amount
    });
    const transferReceipt = await transfer.awaitReceipt();
    return transferReceipt;
}


// 激活zkSync账户，账户被激活后才能在zkSync Leyer2网络里执行转账功能
const activeAccount = async _ => {
    // To control assets in zkSync network, an account must register a separate public key once.
    if (!(await syncWallet.isSigningKeySet())) {
        if ((await syncWallet.getAccountId()) == undefined) {
            throw new Error('AA Unknown account');
        }
        // As any other kind of transaction, `ChangePubKey` transaction requires fee.
        // User doesn't have (but can) to specify the fee amount. If omitted, library will query zkSync node for
        // the lowest possible amount.
        const changePubkey = await syncWallet.setSigningKey({
            feeToken: 'ETH',
            ethAuthType: 'ECDSA'
        });

        // Wait until the tx is committed
        const recetp = await changePubkey.awaitReceipt();
        console.log(recetp);
        console.log("激活成功");
    } else {
        console.log("此账户已经被激活过了");
    }
}


const getBalance = async _ => {
    // 查余额
    const committedEthBalance = await syncWallet.getBalance('ETH', "committed");
    const balance_wei_Hex = committedEthBalance._hex;

    // // Retrieving the balance of an account in the last finalized block zkSync.md#confirmations-and-finality
    // const finalizedEthBalance = await syncWallet.getBalance('ETH', "finalized");
    // const balance_wei_Hex = finalizedEthBalance._hex;

    // const verifiedETHBalance = await syncWallet.getBalance('ETH', 'verified');
    // const balance_wei_Hex = verifiedETHBalance._hex;

    const value = ethers.utils.formatEther(balance_wei_Hex);
    console.log(value);
}

(async _ => {
    // 获取块高
    let blockNumber = await ethersProvider.getBlockNumber();
    console.log(JSON.stringify({ blockNumber }));

    // await activeAccount();

    // 
    await depositToSyncFromEthereum('0.05');

    // let transferReceipt = await transferETH("0xb03C7a7CD436f9Bce321204576D3cdFdAe6C276E", '0.0001');
    // console.log(transferReceipt);

    // let txHash = await withdrawFromSyncToEthereum('0.01');
    // console.log(txHash);

    getBalance();

})()

