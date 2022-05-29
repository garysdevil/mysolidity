// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ArrayLib {
    function findIndex(uint256[] storage arr, uint256 x)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < arr.length; i++) {
            if (arr[i] == x) {
                return i;
            }
        }
        revert("MyError not found");
    }
}

contract TestArray {
    using ArrayLib for uint256[];
    uint256[] public arr = [3, 2, 1];

    function testFindIndex() external view returns (uint256 index) {
        // return ArrayLib.findIndex(arr, 2); // 方式一 直接调用
        return arr.findIndex(2); // 方式二 通过using关键字将库引入给某个类型的数据进行使用，然后这个类型的数据就可以直接调用库里的函数
    }
}
