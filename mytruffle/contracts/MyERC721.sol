// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // // npm install @openzeppelin/contracts --include=dev

contract MyERC721 is ERC721{
    constructor() ERC721("Pig", "PIG"){}

    // constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_){}

    function mint(address toAddr, uint tokenID) public{
        _safeMint(toAddr, tokenID);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "tokenURI function: don't exist this token");

        string memory baseURI = "base_cid";
        // return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId)) : "";
        return string(abi.encodePacked('ipfs://', baseURI, '/prefix-', Strings.toString(tokenId), '.jpeg'));
    }
}