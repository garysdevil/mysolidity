import * as zksync from 'zksync';
import * as ethers from 'ethers';

// 调用此脚本内的函数前，需要先执行初始化操作 init()

var ethWallet;
var syncWallet;

// zksync_netowrk = georli 或 mainnet
const init = async (ethereum_url, zksync_netowrk, wallet_private_key) => {
    // 和以太坊网络交互
    // const ethersProvider = ethers.getDefaultProvider('mainnet');
    const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

    // 和zkSync网络交互
    const syncProvider = await zksync.getDefaultProvider(zksync_netowrk);

    ethWallet = new ethers.Wallet(wallet_private_key).connect(ethersProvider);
    syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);

    console.log("zksync初始化操作 syncWallet account ID 为 ", await syncWallet.getAccountId());
}

// 充值进zkSync 二层网络
// 输入 以太坊代币 '0,1'
const depositToSyncFromEthereum = async (value_ETH, wait_flag = false) => {
    // 充值进zksync网络，需要消耗 62618 gas费。  消耗的以太坊=62618*value_Gwei*0.000000001
    const deposit = await syncWallet.depositToSyncFromEthereum({
        depositTo: syncWallet.address(),
        token: 'ETH',
        amount: ethers.utils.parseEther(value_ETH)
    });
    const ethTxHash = deposit.ethTx.hash;

    // 默认不等待最终的确认
    if (wait_flag == false) {
        return ethTxHash;
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
        console.log("激活成功");
        return recetp;
    } else {
        console.log("此账户已经被激活过了");
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

// const contentHash = 'QmYxT4LnK8sqLupjbS6eRvu1si7Ly2wFQAqFebxhWntcf6';
const mintNFT = async (contentHash) => {
    console.log(syncWallet.address());
    const nft = await syncWallet.mintNFT({
      recipient: syncWallet.address(),
      contentHash
    });
    console.log(nft);
    // return nft.txHash;
}



export { init, depositToSyncFromEthereum, withdrawFromSyncToEthereum, activeAccount, transferETH, getBalance, mintNFT };