// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

// 默认接受收款的函数receive
contract ReceiveEther {
    address public varAddress;
    uint256 public varNum;

    receive() external payable {
        // varAddress = msg.sender;
        // varNum = 200;
        //    当此函数体内有执行语句时，当另一个合约调用以下方法给此合约转账时，会返回false值，从而可能出发报错
        //     _to.transfer(msg.value);
        //     _to.send(msg.value);
    }

    function test() public {
        varAddress = msg.sender;
        varNum = 101;
    }

    // 查询这个合约的以太坊余额
    function getSelfBalance() public view returns (uint) {
        return address(this).balance;
    }

    // 查询特定地址下的以太坊余额
    function getBalance(address addr) public view returns (uint) {
        return address(addr).balance;
    }
}


// 三种转账方式 _to.transfer _to.send _to.call
contract SendEther {
    // 转账方式一 转账给 _to
    // 官方不再推荐使用 
    function sendViaTransfer(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    // 转账方式二 转账给  _to
    // 官方不再推荐使用 
    function sendViaSend(address payable _to) public payable {
        // Send returns a boolean value indicating success or failure.
        // send是transfer的底层实现。 _to.transfer(y) 等于 if (!_to.send(y)) throw;
        bool sent = _to.send(msg.value); 
        require(sent, "Failed to send Ether");
    }

    // 转账方式二 转账给  _to
    // 官方目前推荐使用的转账方式
    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}