// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("Dog", "DOG") {}

    // constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol){}

    function mint(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }
}
