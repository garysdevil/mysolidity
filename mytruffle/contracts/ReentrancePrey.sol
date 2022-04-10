// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2 <0.8.0;

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
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
