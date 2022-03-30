const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

initTree = (stringArrayVar) =>  {
    const leaves = stringArrayVar.map(v => keccak256(v))
    return new MerkleTree(leaves, keccak256, { sort: true })
}

getData = _ => {
    return ["0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D", "0x4053dcc2232168b200c98f87cbc9fff27a9677d7",
    "0x0c2215f4ade8e792b9b7c74da854d485a6e016c1", "0x2adf5e8c3c4c1df395048cee54cf178553514bb0",
    "0x2a052beE1d7c36744dF13D998B700A7f2d94caaf", "0x907CC33C0B606f75836B6818bEFf2a926645B9ba"]
}

getProof = ( tree, stringVar ) =>  {
    const leaf = keccak256(stringVar)
    return tree.getHexProof(leaf)
}

// 链上验证数据是否属于默克尔树
verifyOnline = async( tree ) =>  {
    const ini = require('ini')
    const Web3 = require('web3')
    const fs = require('fs')
    const config = ini.parse(fs.readFileSync('./.local.config.ini', 'utf-8'))
    const rpcURL = config.node.rpc_url  
    const web3 = new Web3(rpcURL)
    const source = fs.readFileSync("../build/contracts/MerkleProof_1.json", 'utf8');
    // const source = fs.readFileSync("../build/contracts/MerkleProof_2.json", 'utf8');
    abi = JSON.parse(source).abi
    const contractAddress = '0x2554F3d7b411Ecd3Eda492Bd9379Fa933C11Dd22' // 合约一
    // const contractAddress = '0x75c7A505EafE7696306aB5a11BAa56F153d179a1' // 合约2二
    
    const contractInstance = new web3.eth.Contract(abi, contractAddress)

    leave = keccak256('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D')
    proof = getProof(tree, '0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D')
    // 合约一
    await contractInstance.methods.verify(leave, proof).call((err, result) => { 
        console.log('result', result)
        console.log('err', err) 
    })
    // // 合约二，链上取调用者地址作为叶子节点。 测试失败
    // await contractInstance.methods.verify( proof ).call({from: '0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D'},(err, result) => { 
    //     console.log('result', result)
    //     console.log('err', err) 
    // })

}

(async _ =>{ 
    const tree = initTree(getData())
    const root = tree.getHexRoot()
    // MerkleTree.print(tree)
    // console.log(root)

    // 链下验证数据是否属于默克尔树
    // const data = 'a'
    // console.log(tree.verify(getProof(data), keccak256(data), root)) // false
    
    // 进行链上验证
    verifyOnline(tree)
})()
