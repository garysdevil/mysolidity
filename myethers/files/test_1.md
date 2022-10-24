

## zksyncv1 交互费用测算
```python
usdt_eth = 1300
value_Gwei = 17

# 以太坊网络转账费用
ethereum_transfer_fee_eth = 21000 * value_Gwei * 0.000000001
fee_usdt = ethereum_transfer_fee_eth * usdt_eth
print("以太坊网络转账，消耗的交易费ETH=", ethereum_transfer_fee_eth, ", USDT=", fee_usdt) # 以太坊网络转账，消耗的交易费ETH= 0.000357 , USDT= 0.4641


# 充值进zkSync 二层网络，消耗的gas为62618
deposite_fee_eth = 62618 * value_Gwei * 0.000000001
fee_usdt = deposite_fee_eth* usdt_eth 
print("充值进zkSync 二层网络，消耗的交易费ETH=", deposite_fee_eth, ", USDT=", fee_usdt) # 充值进zkSync 二层网络，消耗的交易费ETH= 0.001064506 , USDT= 1.3838578

# Gwei=14, zkSync激活账户需要消耗的以太坊为0.000433，动态变化
active_fee_eth = 0.000442
fee_usdt = active_fee_eth * usdt_eth
print("活账户，消耗的交易费ETH=", active_fee_eth, ", USDT=", fee_usdt) # 活账户，消耗的交易费ETH= 0.000442 , USDT= 0.5746

# Gwei=14, zksync网络内转账消耗的以太坊为0.00001433，动态变化
transfer_fee_eth = 0.00001433
fee_usdt = transfer_fee_eth * 1300
print("zksync网络内转账，消耗的交易费ETH=", transfer_fee_eth, ", USDT=", fee_usdt) # zksync网络内转账，消耗的交易费ETH= 0.00001407 , USDT= 0.018629

# Gwei=14, zksync网络内mint NFT消耗的以太坊为 0.0000558
mint_fee_eth = 0.0000558
fee_usdt = transfer_fee_eth * 1300
print("zksync网络内转账，消耗的交易费ETH=", mint_fee_eth, ", USDT=", fee_usdt) # zksync网络内转账，消耗的交易费ETH= 5.58e-05 , USDT= 0.018629

# 评估zksync网络内总消耗交易费 0.001576376
# 评估总消耗交易费 0.001933376
```
