// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ABIDecoe {
    struct MyStruct {
        string name;
        uint256[2] nums;
    }

    // 编码 结构体在remix里的输入方式 ["11",[1,2]]
    function encode(
        uint256 x,
        address addr,
        uint256[] calldata arr,
        MyStruct calldata myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(x, addr, arr, myStruct);
    }

    // 解码
    function decode(bytes calldata data)
        external
        pure
        returns (
            uint256 x,
            address addr,
            uint256[] memory arr,
            MyStruct memory myStruct
        )
    {
        (x, addr, arr, myStruct) = abi.decode(
            data,
            (uint256, address, uint256[], MyStruct)
        );
    }
}
