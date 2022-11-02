import * as zksync from 'zksync';
import * as ethers from 'ethers';

// 调用此脚本内的函数前，需要先执行初始化操作 init()

var syncWallet;

// zksync_netowrk = georli 或 mainnet
const init = async (ethereum_url, zksync_netowrk, wallet_private_key) => {
    // 和以太坊网络交互
    // const ethersProvider = ethers.getDefaultProvider('mainnet');
    const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

    // 和zkSync网络交互
    const syncProvider = await zksync.getDefaultProvider(zksync_netowrk);

    const ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

    console.log("zksync初始化操作, accountId=", await syncWallet.getAccountId(), 'actived=', await syncWallet.isSigningKeySet());
    return syncWallet;
}

// 充值进zkSync 二层网络
// const value_ETH = '0.1'
// const ethTxOptions = {gasPrice: ethers.utils.parseUnits(1, "gwei"), nonce: 0} // 可以输入 gasPrice，不可以输入 maxPriorityFeePerGas
const depositToSyncFromEthereum = async (value_ETH, ethTxOptions = null, wait_flag = false) => {
    // 充值进zksync网络，需要消耗 62618 gas费。  消耗的以太坊=62618*value_Gwei*0.000000001
    const deposit = await syncWallet.depositToSyncFromEthereum({
        depositTo: syncWallet.address(),
        token: 'ETH',
        amount: ethers.utils.parseEther(value_ETH),
        ethTxOptions
    });
    // 默认不等待最终的确认
    if (wait_flag == false) {
        console.log('ethTxHash=', deposit.ethTx.hash);
        return deposit.ethTx;
    } else {
        console.log('ethTx=', deposit.ethTx);
    }
    // 需要等很久
    // Await confirmation from the zkSync operator
    // Completes when a promise is issued to process the tx
    const depositReceipt1 = await deposit.awaitReceipt();
    console.log("depositReceipt1", depositReceipt1);

    // 需要等很久
    // Await verification
    // Completes when the tx reaches finality on Ethereum
    const depositReceipt2 = await deposit.awaitVerifyReceipt();
    console.log("depositReceipt2", depositReceipt2);
}

// 取回代币进Ethereum网络
const withdrawFromSyncToEthereum = async (value_ETH, to_address) => {
    const withdraw = await syncWallet.withdrawFromSyncToEthereum({
        ethAddress: to_address,
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


// 激活zkSync账户，账户被激活后才能在zkSync Leyer2网络里执行转账功能
const activeAccount = async _ => {
    // To control assets in zkSync network, an account must register a separate public key once.
    if (!(await syncWallet.isSigningKeySet())) {
        if ((await syncWallet.getAccountId()) == undefined) {
            throw new Error('Fun activeAccount: Unknown account');
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
        console.log("账户激活成功", syncWallet.address());
        return recetp;
    } else {
        console.log("此账户已经被激活过了", syncWallet.address());
    }
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

// 查余额，函数返回值的单位为ETH
const getBalance = async _ => {
    const committedEthBalance = await syncWallet.getBalance('ETH', "committed");
    const balance_wei_Hex = committedEthBalance._hex;

    // // Retrieving the balance of an account in the last finalized block zkSync.md#confirmations-and-finality
    // const finalizedEthBalance = await syncWallet.getBalance('ETH', "finalized");
    // const balance_wei_Hex = finalizedEthBalance._hex;

    // const verifiedETHBalance = await syncWallet.getBalance('ETH', 'verified');
    // const balance_wei_Hex = verifiedETHBalance._hex;

    const balance = ethers.utils.formatEther(balance_wei_Hex);
    return JSON.stringify({ balance });
}

// const contentHash = '0x2dc9c5fabf876944e15bf2d2489d4d3dbc1f691319da0b85a24c3f3e28f3b13b';
const mintNFT = async (contentHash, waitFlag = false) => {
    const nft = await syncWallet.mintNFT({
        recipient: syncWallet.address(),
        contentHash,
        feeToken: 'ETH'
    });

    console.log("mintNFT txHash=", nft.txHash);

    if (waitFlag == true) {
        const receipt = await nft.awaitReceipt();
        console.log(receipt)
    }
    const txHash = nft.txHash;
    return JSON.stringify({ txHash });
}



export { init, depositToSyncFromEthereum, withdrawFromSyncToEthereum, activeAccount, transferETH, getBalance, mintNFT };