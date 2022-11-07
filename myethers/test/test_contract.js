import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';
import * as utils from '../utils/utils.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;

const wallet_private_key = config.wallet_private_key;
const wallet_address = config.wallet_address;
const wallet_address_a = config.wallet_address_a;

const ethersProvider = new ethers.providers.JsonRpcProvider(ethereum_url);

const testCoinContract = async _ => {

    // You can also use an ENS name for the contract address
    // const daiMainnetAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const coinTestnetAddress = "0x3aEe4b05C117D48241AdbaEc05b1DA9fC49200B1";

    // The ERC-20 Contract ABI, which is a common contract interface
    // for tokens (this is the Human-Readable ABI format)
    const erc20Abi = [
        // Some details about the token
        "function name() view returns (string)",
        "function symbol() view returns (string)",
    
        // Get the account balance
        "function balanceOf(address) view returns (uint)",
    
        // Send some of your tokens to someone else
        "function transfer(address to, uint amount)",
    
        // An event triggered whenever anyone transfers to someone else
        "event Transfer(address indexed from, address indexed to, uint amount)",
    
        "function mint(address receiver, uint256 amount)"
    ];

    const coinContract = new ethers.Contract(coinTestnetAddress, erc20Abi, ethersProvider);

    console.log(await coinContract.name());
    console.log(await coinContract.symbol());

    const balance = await coinContract.balanceOf(wallet_address); // 返回BigNumber
    console.log(ethers.utils.formatUnits(balance, 18));

    // connect to a Signer
    const wallet = ethers_online.initWallet(ethersProvider, wallet_private_key);
    const coinWithSigner = coinContract.connect(wallet);

    const coin = ethers.utils.parseUnits("1.0", 18);
    // const tx = await coinWithSigner.mint(wallet_address, coin);

    const estimateGas = await coinWithSigner.estimateGas.mint(wallet_address, coin);
    console.log("estimateGas:", ethers.utils.formatUnits(estimateGas, 18));
    let overrides = {
        gasLimit: estimateGas,
        maxFeePerGas: ethers.utils.parseUnits('0.1', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('0.001', 'gwei'),
        // nonce: (await provider.getTransactionCount(wallet.getAddress()))
    };


    const tx = await coinWithSigner.mint(wallet_address, coin, overrides);
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
}

const xen = async _ => {
    // const tx = await coinWithSigner.mint(wallet_address, coin, overrides);
    const xenMainnetAddress = "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8"
    const xenContract = new ethers.Contract(xenMainnetAddress, abi, ethers_online.initWallet(ethersProvider, wallet_private_key));
    const estimateGas = await xenContract.estimateGas.claimRank(415);
    console.log("estimateGas:", ethers.utils.formatUnits(estimateGas, 18));
    let overrides = {
        gasLimit: estimateGas,
        maxFeePerGas: ethers.utils.parseUnits('12', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('5', 'gwei'),
        // nonce: (await provider.getTransactionCount(wallet.getAddress()))
    };
    console.log(await ethersProvider.getTransactionCount(wallet_address_a));
}

(async _ => {

    const abi = [
        "function claimRank(uint256 term)",
    ];

    await testCoinContract();
})()