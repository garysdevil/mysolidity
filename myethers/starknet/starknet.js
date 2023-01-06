// https://www.starknetjs.com/

import fs from "fs";
import {
  Account,
  Contract,
  defaultProvider,
  ec,
  json,
  number,
  hash,
  stark,
  SequencerProvider,
  RpcProvider
} from "starknet";

// class hash of OpenZeppelin Account contract version 0.5.1
const ArgentXContractClassHash = '0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918';

// get the compiled contract ABI, in this case OpenZeppelin
const compiledOZAccount = json.parse(
  fs.readFileSync("./ArgentXAccount.json").toString("ascii")
);

const getPrecalculatedAddress = (privateKey) => {
  if (privateKey == undefined){
    privateKey = stark.randomAddress();
    console.log("Random Private Key=", privateKey);
  }


  // const privateKey = ''; // you can use stark.randomAddress();
  const starkKeyPair = ec.getKeyPair(privateKey);
  const starkKeyPub = ec.getStarkKey(starkKeyPair);

  const precalculatedAddress = hash.calculateContractAddressFromHash(
    starkKeyPub, // salt
    ArgentXContractClassHash,
    [starkKeyPub],
    0
  );
  return precalculatedAddress;
}

const deployAccountAccount = async (provider, privateKey, precalculatedAddress) => {
  const starkKeyPair = ec.getKeyPair(privateKey);
  const starkKeyPub = ec.getStarkKey(starkKeyPair);

  const account = new Account(provider, precalculatedAddress, starkKeyPair);

  // This is OpenZeppelin account contract deployment
  const accountResponse = await account.deployAccount({
    classHash: ArgentXContractClassHash,
    constructorCalldata: [starkKeyPub],
    contractAddress: precalculatedAddress,
    addressSalt: starkKeyPub
  });
  
  console.log("-----1");
  console.log(accountResponse);
  console.log("-----2");

  await provider.waitForTransaction(accountResponse.transaction_hash);
  
  console.log("-----3");
  console.log(accountResponse);
  console.log("-----4");
}

const getProvider = _ => {
  // const nodeUrl = ""
  // const provider = new RpcProvider({ nodeUrl })
  
  // 默认为 testnet2
  // const provider = process.env.STARKNET_PROVIDER_BASE_URL === undefined ?
  //   defaultProvider : 
  //   new SequencerProvider({ baseUrl: process.env.STARKNET_PROVIDER_BASE_URL });

  // testnet1
  const provider = new SequencerProvider({
    baseUrl: 'https://alpha4.starknet.io',
    feederGatewayUrl: 'feeder_gateway',
    gatewayUrl: 'gateway',
  })

  return provider;
}

(async _ => {
  const privateKey = "私钥";
  const precalculatedAddress = getPrecalculatedAddress(privateKey)
  console.log("precalculatedAddress=", precalculatedAddress);

  const provider = getProvider();
  // await deployAccountAccount(provider, privateKey, precalculatedAddress);  运行失败

  console.log("ChainId=", await provider.getChainId());
  // console.log("BlockNumber=", await provider.getBlockNumber());
  console.log("BlockNumber=", (await provider.getBlock('latest')).block_number);

  
})()