## 手动安装依赖
```bash
npm install @openzeppelin/contracts
npm install @truffle/hdwallet-provider

npm install ini
npm install web3
npm install merkletreejs
npm install keccak256
```

## 编译部署
```bash
# 编译部署
truffle migrate --reset --network development
```

## 编译测试
```bash
# 启动本地测试环境
truffle develop --log
# 执行测试代码
truffle test --network local
```

# 学习
## truffile
- 关于测试
    - Truffle集成了Mocha测试框架和Chai断言库
```bash
# 使用truffile框架初始化一个项目
truffle init 

# 启动一个包含了本地开发区块链的控制台，支持在控制台中 与合约交互
truffle develop
# --log 启动truffle开发会话并记录全部RPC活动。


# 编译合约，默认为编译自上次编译之后更新过的合约
truffle compile
# --all：编译全部合约
# --list ：列出来自solc-bin的最近稳定版本清单

# 部署合约，默认从最后完成的迁移脚本开始运行部署。
truffle migrate --reset # 等同于 truffle deploy --reset
# --network
# --reset 部署所有的合约


```