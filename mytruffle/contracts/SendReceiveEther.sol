// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 默认接受收款的函数receive
contract EtherWallet {
    address payable public owner;

    event Log(uint256 amout, uint256 gas);

    constructor() payable {
        owner = payable(msg.sender);
    }

    receive() external payable {
        emit Log(msg.value, gasleft());
        // 当此函数体内有执行改变状态变量的语句时，当另一个合约通过_to.transfer或_to.send给此合约转账时，会返回false值
    }

    // 查询这个合约的以太坊余额
    function getSelfBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // 查询特定地址下的以太坊余额
    function getBalance(address _addr) public view returns (uint256) {
        return address(_addr).balance;
    }

    // 提取余额
    function withdrawBalance(uint256 _amount) external {
        require(msg.sender == owner, "caller is not owner");
        //   owner.transfer(_amount);
        payable(msg.sender).transfer(_amount); // 使用内存中的变量msg.sender来节约gas
    }
}

// 三种转账方式 _to.transfer _to.send _to.call
contract SendEther {
    // 转账方式一 转账给 _to // 官方不再推荐使用 // 花费2300gas
    function sendViaTransfer(address payable _to) public payable {
        // 转账不成功则会reverts
        _to.transfer(msg.value);
    }

    // 转账方式二 转账给  _to // 官方不再推荐使用 // 花费2300gas
    function sendViaSend(address payable _to) public payable {
        // 会返回一个bool类型的值来判断成功与失败
        // send是transfer的底层实现。 _to.transfer(y) 等于 if (!_to.send(y)) throw;
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    // 转账方式三 转账给  _to // 官方目前推荐使用的转账方式 // 花费所有的gas
    function sendViaCall(address payable _to) public payable {
        // 会返回一个bool类型的值来判断成功与失败
        //   (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
