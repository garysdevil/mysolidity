// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 合约间的相互调用 方式一 已知被调用合约的代码情况下。
// 将被调用的合约通过类型引用进来。调用方式： 合约地址.方法名称()  或者 address(合约名称).方法名称()
contract CallTestContract {
    function setX(TestContract _test, uint256 _x) external {
        _test.setX(_x);
    }

    function getX(address _test) external view returns (uint256 x) {
        x = TestContract(_test).getX();
    }

    function setXAndSendEther(address _test, uint256 _x) external payable {
        TestContract(_test).setXAndReceiveEther{value: msg.value}(_x);
    }

    function getXAndValue(address _test)
        external
        view
        returns (uint256 _x, uint256 value)
    {
        (_x, value) = TestContract(_test).getXAndValue();
    }
}

// 被调用的合约
contract TestContract {
    uint256 public x = 1;
    uint256 public value = 11;

    function setX(uint256 _x) external {
        x = _x;
    }

    function getX() external view returns (uint256) {
        return x;
    }

    function setXAndReceiveEther(uint256 _x) external payable {
        x = _x;
        value = msg.value;
    }

    function getXAndValue() external view returns (uint256, uint256) {
        return (x, value);
    }
}
