
const Router = require('koa-router')
const ethService = require('./web3Rpc')
const Web3Utils = require('web3-utils');

const router = new Router();
router.prefix('/eth')

//创建账户
router.get('/createAccount', async (ctx, next) => {
    let acc = ethService.createAccount()
    ctx.body = acc
})

//获取gas价格
router.get('/gasPrice', async (ctx, next) => {
    let price = await ethService.getGasPrice()
    console.log(Web3Utils.fromWei(price, 'gwei'))
    ctx.body = price
})

//查询账户余额
router.get('/getBalance', async (ctx, next) => {
    let balance = await ethService.getBalance('0xfeda2DCb016567DEb02C3b59724cf09Dbc41A64D')
    console.log(balance)
    ctx.body = balance
})

// //交易
// router.get('/tran', async (ctx, next) => {
//     let hash = await ethService.tran('fromAdd', 'toAdd'
//         , "1", "21000", 'from账户私钥privatekey')
//     console.log(hash)
//     ctx.body = hash
// })

// //合约余额
// router.get('/conBalance', async (ctx, next) => {
//     let valance = await conService.balance('账户add')
//     console.log(valance)
//     ctx.body = valance
// })

// //合约代币交易
// router.get('/conTran', async (ctx, next) => {
//     let hash = await conService.tran('fromAdd', 'toAdd', '100', '200000', 'from账户私钥privatekey')
//     console.log(hash)
//     ctx.body = hash
// })

module.exports = router


