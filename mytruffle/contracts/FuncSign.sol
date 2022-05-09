// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 函数签名 // 在EVM中如何在合约中找到一个函数
contract funcSign{
    // 获取函数选择器
    function getSelector(string calldata _func) external pure returns(bytes4){
        return(bytes4(keccak256(bytes(_func))));
    }

    // 输入 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4 9
    // 返回的msg.data就是如下信息：前8位是被哈希过的函数名（称之为函数选择器、函数签名），并且被截取了前4个字节；后面每32个字节就是一个输入参数
    // 0xba14d606
    // 0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc4
    // 0000000000000000000000000000000000000000000000000000000000000009
    event Log(bytes data);
    function test(address _to, uint _amount) external{
        emit Log(msg.data);
    }
}