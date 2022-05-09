// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HashFunc{
    function hash(string memory text,uint num, address addr) external pure returns(bytes32){
        return keccak256(abi.encode(text, num, addr));
    }
    // 打包为16进制 方式一 此方式会补0直到4字节长度
    function encode(string memory text1,string memory text2) external pure returns(bytes memory){
        return abi.encode(text1, text2);
    }
    // 打包为16进制 方式二 此方式因为不会补0，当进行hash是容易产生碰撞。例如输入 aaa bb 或 aa abb 得到的打包结果是一样的，那么进行hash时的结果也将是一样的，这样就产生了hash碰撞。
    function encodePacked(string memory text1,string memory text2) external pure returns(bytes memory){
        return abi.encodePacked(text1, text2);
    }
}