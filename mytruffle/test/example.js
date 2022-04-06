// `require`合约并将其分配给一个变量`MyContract`
const MyContract = artifacts.require('../contracts/ReceiveEther.sol');

// 调用“contract”函数，并在回调函数中编写所有测试
// 回调函数提供一个“accounts”变量，表示本地区块链上的所有帐户。
contract('MyContract', (accounts) => {
    // 第1个测试
    it('initializes with the correct value', async () => {
        // 获取合约实例
        const myContract = await MyContract.deployed()
        // 调用合约的方法
        const value = await myContract.varNum()
        // 使用断言测试value的值
        assert.equal(value, '0')
    })
    // 第2个测试
    it('can update the value', async () => {
        const myContract = await MyContract.deployed()
        await myContract.value(10);
        const value = await myContract.varNum()
        assert.equal(value, '101')
    })
})