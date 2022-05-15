// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 如果想在一次交易中，对函数执行多次调用则通过这个方式
contract MultiDelegateCall{
    function multiDelegateCall(address[] calldata targetArr, bytes[] calldata abiDataArr) payable external returns(bytes[] memory){
        require(targetArr.length == abiDataArr.length, "targetArr length != abiDataArr length");
        bytes[] memory resultArr = new bytes[](abiDataArr.length);

        for(uint i = 0; i < targetArr.length; i++){
            (bool success, bytes memory result) = targetArr[i].delegatecall(abiDataArr[i]);
            require(success, "delegatecall failed");
            resultArr[i] = result;
        }
        return resultArr;
    }
}

// 合约必须继承MultiDelegateCall合约，来使用multiDelegateCall，否则修改的状态变量还是MultiDelegateCall合约里的。
contract TestMultiDelegateCall is MultiDelegateCall{
    event Log(address caller, string func, uint number);

    function func1(uint x, uint y) external{
        emit Log(msg.sender, "func1", x + y);
    }
    function func2() external returns(uint){
        emit Log(msg.sender, "func2", 2); 
        return 2;
    }

    mapping(address => uint) public balanceOf;
    // 当继承multi-delegatecall合约结合使用时，会出现漏洞。使得即使外部用户只发送一次以太坊，但mint函数执行了多次，所以用户在合约里的余额也会增加多次。
    function mint() payable external{
        balanceOf[msg.sender] += msg.value;
    }


    function getFunc1ABI(uint x, uint y) external pure returns(bytes memory){
        return abi.encodeWithSelector(this.func1.selector, x, y);
    }
    function getFunc2ABI() external pure returns(bytes memory){
        return abi.encodeWithSelector(this.func2.selector);
    }
    function getMintABI(address addr) external pure returns(bytes memory){
        return abi.encodeWithSelector(this.mint.selector, addr);
    }
}
