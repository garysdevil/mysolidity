// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 合约间的相互调用 方式二 接口调用。
// 只要知道被调用合约的函数名称、输入参数、输出参数，就可以调用对方的合约
interface ICounter{
    function  count() external view returns(uint);
    function increament() external;
    function decreament() external;
}
contract CallInterface{
    uint public count;

    function callInterface(address _counter) external{
        ICounter(_counter).increament();
        count = ICounter(_counter).count();
    }
}


// 被调用的合约
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Counter{
    uint public count;

    function increament() external{
        count += 1;
    }
    function decreament() external{
        count -= 1;
    }
}