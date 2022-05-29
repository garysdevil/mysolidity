// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2 <0.8.0;

// 防止重入的修饰器
contract ReEntrancyGuard {
    bool internal locked;

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
}

contract Prey is ReEntrancyGuard {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public noReentrant {
        require(balances[msg.sender] >= amount);

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");

        // balances[msg.sender] = 0;
        balances[msg.sender] -= amount; // 大于0.8.0的solidity编译器自带safemath，拥有益处检测机制。
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
