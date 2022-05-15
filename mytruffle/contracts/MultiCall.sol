// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestMultiCall{
    function func1() external view returns(uint, uint) {
        return(1, block.timestamp);
    }
    function func2() external view returns(uint, uint) {
        return(2, block.timestamp);
    }
    function getABIData1() external pure returns(bytes memory){
        return abi.encodeWithSelector(this.func1.selector);
    }
    function getABIData2() external pure returns(bytes memory){
        return abi.encodeWithSelector(this.func2.selector);
    }
}


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// 如果想在一次交易中，对函数执行多次调用则通过这个方式
contract MultiCall{
    function multiCall(address[] calldata targetArr, bytes[] calldata abiDataArr) external view returns(bytes[] memory){
        require(targetArr.length == abiDataArr.length, "targetArr length != abiDataArr length");
        bytes[] memory resultArr = new bytes[](abiDataArr.length);

        for(uint i = 0; i < targetArr.length; i++){
            // address.staticcall() 静态调用,只能调用不改变状态变量的函数
            (bool success, bytes memory result) = targetArr[i].staticcall(abiDataArr[i]);
            require(success, "staticcall failed");
            resultArr[i] = result;
        }
        return resultArr;
    }
}