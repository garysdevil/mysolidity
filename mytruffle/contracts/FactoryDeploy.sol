// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Account{
    address public bank;
    address public owner;

    constructor(address _owner) payable{
        bank = msg.sender;
        owner = _owner;
    }
}

// 被部署的合约和工厂合约需要在同一个文件里
contract FactoryDeploy{
    Account[] public accountArr;

    function deployAccountContract(address _owner) external {
        Account account = new Account{value: 1111}(_owner);
        // 记录被部署合约生成的地址
        accountArr.push(account);
    }
}