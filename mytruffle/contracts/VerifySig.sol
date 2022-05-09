 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
链下进行消息的签名
1. hash(message)
2. sign(hash(message), private key)
链上验证被签名的消息
ecrecover(hash(message), signature) == signer
*/

// 验证签名是否来自于指定的地址
contract Verify{
    // 输入 签名地址，未被签名的数据，签名后的数据
    function verify(address _signer, string memory _message, bytes memory _sig) external pure returns(bool){
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignMessageHash = getEthSignedMessageHash(messageHash);

        return recover(ethSignMessageHash, _sig) == _signer;
    }

    function getMessageHash(string memory _message) public pure returns(bytes32){
        return keccak256(abi.encodePacked(_message));
    }
    function getEthSignedMessageHash(bytes32 _massageHash) public pure returns(bytes32){
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _massageHash));
    }
    function recover(bytes32 _ethSignMessageHash, bytes memory _sig) public pure returns(address){
        (bytes32 r, bytes32 s, uint8 v) = _split(_sig); // 非对称加密算法会把信息签名为rsv 3个变量，现在要将数据分割出这三个变量
        return ecrecover(_ethSignMessageHash, v, r, s); // 通过EVM的内部函数ecrecover获取被签名数据的签名地址
    }
    function _split(bytes memory _sig) internal pure returns(bytes32 r, bytes32 s, uint8 v){
        require(_sig.length == 65, "invalid signature length");

        assembly{
            r := mload(add(_sig, 32)) // 使用add()来跳过前32位，使用mload来加载内存里4个字节的数据
            s := mload(add(_sig, 64))
            v := byte(0,mload(add(_sig, 96))) // 使用byte()来数据转换为1个字节
        }
    }
}

