// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestContract1 {
    address public owner = msg.sender;
    
    function setOwner(address _newOwner) external{
        require(msg.sender == owner, "YourError: not owner");
        owner = _newOwner;
    }
}

contract TestContract2 {
    address public owner = msg.sender;
    uint public value = msg.value;
    uint public x;
    uint public y;

    constructor(uint _x, uint _y) payable {
        x = _x;
        y = _y;
    }
}

contract ProxyOld {
    // 简单地部署合约，每次都需要修改代码
    function deploy() external{
        new TestContract1();
    }
}
contract Proxy {
    event Deploy(address);
    receive() external payable {}
    // 输入合约机器码，进行合约部署
    function deploy(bytes memory _code) external payable returns(address addr){
        // 通过内联汇编的方式部署合约
        assembly{
            // create(v,p,n)
            // v = 调用者发送的以太币数量，通常需要使用msg.value来获取, 但在内联汇编中需要使用callvalue()来获取
            // p = 代码在内存中开始位置的指针
            // n = 代码的大小
            addr := create(callvalue(), add(_code, 0x20), mload(_code))
        }
        require(address(addr) != address(0), "MyError: deploy failed");
        emit Deploy(addr);
    }
    // 输入合约地址、被签名过的方法二进制数据，调用合约方法
    function execute(address _target, bytes memory _data) external payable{
        (bool success,) = _target.call{value: msg.value}(_data);
        require(success, "MyError: execute failed");
    }
}

contract Helper{
    function getBytecode1() external pure returns(bytes memory){
        bytes memory bytecode = type(TestContract1).creationCode; // 获取一个TestContract1合约的机器码
        return bytecode;
    }
    function getBytecode2(uint _x, uint _y) external pure returns(bytes memory){
        bytes memory bytecode = type(TestContract2).creationCode; // 获取一个TestContract2合约的机器码
        return abi.encodePacked(bytecode, abi.encode(_x, _y));
    }
    function getCalldata(address _owner) external pure returns (bytes memory){
        return abi.encodeWithSignature("setOwner(address)", _owner);
    }
}