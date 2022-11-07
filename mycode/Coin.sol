// SPDX-License-Identifier: GPL-3.0
// pragma solidity ^0.8.4;
pragma solidity >=0.8.0 <0.9.0;

contract Coin {
    // The keyword "public" makes variables
    // accessible from other contracts
    address public owner;
    mapping(address => uint256) public balances;
    string private _name;
    string private _symbol;

    // Events allow clients to react to specific
    // contract changes you declare
    event Transfer(address from, address to, uint256 amount);

    // Constructor code is only run when the contract is created
    constructor() {
        owner = msg.sender;
        _name = "GG Stablecoin";
        _symbol = "GG";
    }

    function name() public view returns (string memory) {
        return _name;
    }
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    // Sends an amount of newly created coins to an address
    // Can only be called by the contract creator
    function mint(address receiver, uint256 amount) public {
        // require(msg.sender == owner);
        balances[receiver] += amount;
    }

    // Errors allow you to provide information about
    // why an operation failed. They are returned
    // to the caller of the function.
    error InsufficientBalance(uint256 requested, uint256 available);

    // Sends an amount of existing coins
    // from any caller to an address
    function transfer(address receiver, uint256 amount) public {
        if (amount > balances[msg.sender])
            revert InsufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
    }

    // 获取余额
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
