import * as ethers from 'ethers';
import fs from 'fs';
import ini from 'ini';

import * as ethers_online from '../ethers/ethers_online.js';
import * as utils from '../utils/utils.js';

const config = ini.parse(fs.readFileSync("../conf/.local.config.ini", 'utf-8'));
const ethereum_url = config.fullnode.ethereum_rpc_url;
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
    const estimateGas = await coinWithSigner.estimateGas.mint(wallet_address, coin);
    console.log("estimateGas:", ethers.utils.formatUnits(estimateGas, 18));
    let overrides = {
        gasLimit: estimateGas,
        maxFeePerGas: ethers.utils.parseUnits('0.1', 'gwei'),
        maxPriorityFeePerGas: ethers.utils.parseUnits('0.001', 'gwei'),
        // nonce: (await provider.getTransactionCount(wallet.getAddress()))
    };
    // const tx = await coinWithSigner.mint(wallet_address, coin);
    const tx = await coinWithSigner.mint(wallet_address, coin, overrides);
    console.log(tx);
    const receipt = await tx.wait();
    console.log(receipt);
}


const testParaSpaceContract = async (wallet_private_key, wallet_address) => {
    // 以下合约地址皆为测试网地址

    const mintTokenContract = "0x6babadffbd254b386387290cce48e3011bb1f882";
    // mint(address to) 参数一 钱包地址
    const mintTokenContractABI = [ 
        "function mint(address to)",
        "function owner() view returns (address)" ]; 

    const mainContract = "0xd496950582236b5e0dae7fa13acc018492be9c29";
    // supplyERC721(address, (uint256,bool)[], address, uint16)
        // 参数一 ERC720合约地址 0x0D1a602FFaE312379caD1c32D586dC8B5f0f6CED
        // 参数二 (ERC721的NFT序号, true)
        // 参数三 钱包的地址
        // 参数四 0
    // supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)
        // 参数一 ERC20合约地址 USDT 0xb0f7554a44cc178e935ea10c79e7c042d1840044
        // 参数二 授权代币的数量
        // 参数三 钱包地址
        // 参数四 0
    // borrow(address asset,uint256 amount,uint16 referralCode,address onBehalfOf)
        // 参数一 ERC20合约地址
        // 参数二 代币的数量
        // 参数三 0
        // 参数四 钱包地址
    const mainContractABI = [ 
        "function supplyERC721(address asset,tuple[] tokenData,address onBehalfOf,uint16 referralCode)",
        "function supply(address asset,uint256 amount,address onBehalfOf,uint16 referralCode)",
        "function borrow(address asset,uint256 amount,uint16 referralCode,address onBehalfOf)"];


    const ERC721CloneXContract = "0x0d1a602ffae312379cad1c32d586dc8b5f0f6ced";
    // 参数一 主业务合约地址 0xD496950582236b5E0DAE7fA13acc018492bE9c29
    // 参数二 布尔值 true
    const ERC721ContractABI = [ "function setApprovalForAll(address to, bool approved)" ]; 

    const ERC20DaiContract = "0xca1c01465ead33b6d5bfe4997551130362470499"; // ERC20合约
    const ERC20USDTContract = "0xb0f7554a44cc178e935ea10c79e7c042d1840044"
    // 参数一 被授权的地址 主业务合约地址 0xD496950582236b5E0DAE7fA13acc018492bE9c29
    // 参数二 true
    const ERC20ContractABI = [ " function approve(address spender, uint256 tokens) " ];

    const contractObj = new ethers.Contract(mintTokenContract, mintTokenContractABI, ethersProvider);
    // console.log(await contractObj.owner());

    // connect to a Signer
    const wallet = ethers_online.initWallet(ethersProvider, wallet_private_key);
    const contractObjWithSigner = contractObj.connect(wallet);

    // let overrides = {
    //     gasLimit: estimateGas,
    //     maxFeePerGas: ethers.utils.parseUnits('0.1', 'gwei'),
    //     maxPriorityFeePerGas: ethers.utils.parseUnits('0.001', 'gwei'),
    //     // nonce: (await provider.getTransactionCount(wallet.getAddress()))
    // };
    const tx = await contractObjWithSigner.mint(wallet_address);
    console.log("tx.hash=", tx.hash);
    const receipt = await tx.wait();
    console.log("receipt.gasUsed", receipt.gasUsed);
}

(async _ => {
    const wallet_private_key = config.wallet_private_key;
    const wallet_address = config.wallet_address;
    const wallet_private_key_a = config.wallet_private_key_a;
    const wallet_address_a = config.wallet_address_a;

    // await testCoinContract();


    await testParaSpaceContract();
})()