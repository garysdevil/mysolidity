
const testLoot = async _ =>{ 

    // const inboxPath = path.resolve(__dirname, './', '1.sol');
    const source = fs.readFileSync("../build/contracts/Loot.json", 'utf8');
    abi = JSON.parse(source).abi
    const contractAddress = '0x72E64FB05F8Fd372D18c8C463eFbf7cf2A72E798'

    const contractInstance = new web3.eth.Contract(abi, contractAddress)
    // console.log(contractInstance.options.jsonInterface)

    // await contractInstance.methods.name().call((err, result) => { console.log(result) })
    // await contractInstance.methods.owner().call((err, result) => { console.log(result) })

    // // 查看用户拥有多少套装备 balanceOf
    // await contractInstance.methods.balanceOf(accountarr[0]).call((err, result) => { console.log(result) })
    // // ???
    // await contractInstance.methods.getApproved(1).call({from: accountarr[0]},(err, result) => { console.log(result) })
    // // ???
    // await contractInstance.methods.isApprovedForAll(accountarr[0],accountarr[0]).call((err, result) => { console.log(result) })
    // // 通过TokenID查看某套装备的拥有者
    // await contractInstance.methods.ownerOf(100).call((err, result) => { console.log(result) })
    // 通过输入索引返回tokenID
    // await contractInstance.methods.tokenByIndex(2).call((err, result) => { console.log(result) })
    // 通过输入拥有者和装备索引 来获取TokenID
    // await contractInstance.methods.tokenOfOwnerByIndex(accountarr[0],2).call((err, result) => { console.log(result) })
    // 查看这套装备的胸甲
    // await contractInstance.methods.getChest(10).call((err, result) => { console.log(result) })

    // // 查看Loot合约拥有者的地址
    // await contractInstance.methods.owner().call((err, result) => { console.log(result) })
    // // 查看链上一共有多少套装备
    // await contractInstance.methods.totalSupply().call((err, result) => { console.log(result) })



    // 查看生成图片的base64字符串 //((err, result) => { console.log(result) })
    // await contractInstance.methods.tokenURI(1).call().then( (result) => {
    //     return result.substring(29)
    // }).then((result) => {
    //     // typeof(result)
    //     base64string1=(new Buffer.from(result, 'base64')).toString()
    //     base64string2=JSON.parse(base64string1).image.toString().substring(26)
    //     svg = (new Buffer.from(base64string2, 'base64')).toString()
    //     console.log(svg)
    //     // <html><body>svg</body></html>
    // })

    // 将一套装备转移给另一个用户; 输入用户地址和装备的TokenID ？？？ 执行失败
    // await contractInstance.methods.approve(accountarr[1],1).call((err, result) => { console.log(result) })

    // 生成一套套装，输入装备的TokenID
    // await contractInstance.methods.claim(103).send({from: accountarr[1]},(err, result) => { console.log(result) })
    // await contractInstance.methods.claim().send({from: accountarr[1]},(err, result) => { console.log(result) })
    // await contractInstance.methods.a().call((err, result) => { console.log(result) })

    // ??? ownerClaim
    // await contractInstance.methods.ownerClaim(7778).send((err, result) => { console.log(result) })

    // renounceOwnership 放弃所属权
    // await contractInstance.methods.renounceOwnership().send({from: accountarr[2]},(err, result) => { console.log(result) })
    //
    // 通过TokenID转移一套装备归属权
    // await contractInstance.methods.safeTransferFrom(accountarr[0],accountarr[1],100).send({from: accountarr[0]},(err, result) => { console.log(result) })
    // setApprovalForAll 授予给一个用户拥有所有装备的操作权
    // await contractInstance.methods.setApprovalForAll(accountarr[2],true).send({from: accountarr[0]},(err, result) => { console.log(result) })
    
}