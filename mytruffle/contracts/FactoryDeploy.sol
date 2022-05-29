// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Account {
    address public bank;
    address public owner;

    constructor(address _owner) payable {
        bank = msg.sender;
        owner = _owner;
    }
}

// 被部署的合约和工厂合约需要在同一个文件里
contract FactoryDeploy1 {
    Account[] public accountArr;

    function deployAccountContract(address _owner) external payable {
        Account account = new Account{value: 1111}(_owner);
        // 记录被部署合约生成的地址
        accountArr.push(account);
    }
}

// 被部署的合约和工厂合约需要在同一个文件里
// 通过加盐，可以预测新部署合约的地址
contract FactoryDeploy2 {
    Account[] public accountArr;

    function deployAccountContract(address _owner, uint256 _salt)
        external
        payable
    {
        Account account = new Account{value: 1111, salt: bytes32(_salt)}(
            _owner
        );
        // 记录被部署合约生成的地址
        accountArr.push(account);
    }

    //  获取指定合约的地址
    function getAddress(bytes memory bytecode, uint256 _salt)
        public
        view
        returns (address)
    {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint256(hash)));
    }

    // 获取Account合约的字节码
    function getBytecode(address _owner) external pure returns (bytes memory) {
        bytes memory bytecode = type(Account).creationCode; // 获取一个TestContract2合约的机器码
        return abi.encodePacked(bytecode, abi.encode(_owner));
    }
}
