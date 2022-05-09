// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

// selfdestruct函数
// 删除合约
// 强制发送合约的ETH到任何一个地址
contract Kill{
    constructor() payable{}

    function kill() external{
        selfdestruct(payable(msg.sender));
    }
    function test() external pure returns(uint){
        return 110;
    }
}