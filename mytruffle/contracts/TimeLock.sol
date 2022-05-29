// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title 制作一个时间锁合约
/// @author garysdevil
/// @notice 任何人都可以使用这个时间锁合约
/// @notice 将交易放进时间锁合约里，在特定的时间后才能被执行
/// @notice 将交易放进时间锁合约里，未执行则可以从时间锁合约里删除
contract TimeLock {
    address public owner;
    uint256 public minDelay = 60; // 60s
    uint256 public maxDeplay = 600; // 600s

    mapping(address => mapping(bytes32 => bool)) public queueId; // 调用者地址-->交易哈希-->是否已经存在

    error AlreadyQueuedError(address caller, bytes32 txId);
    error NotExistQueuedError(address caller, bytes32 txId);
    error ExecuteError(bytes32 txId);
    error TimestampNotInRangeError();

    event Queue(
        bytes32 txId,
        address indexed _target,
        uint256 _value,
        bytes _data,
        uint256 _timestamp
    );
    event Execute(
        bytes32 txId,
        address indexed _target,
        uint256 _value,
        bytes _data,
        uint256 _timestamp
    );
    event Cancle(address caller, bytes32 txId);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function getHash(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _value, _data, _timestamp));
    }

    function queue(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _timestamp
    ) external {
        if (
            _timestamp < block.timestamp + minDelay ||
            _timestamp > block.timestamp + maxDeplay
        ) {
            revert TimestampNotInRangeError();
        }
        bytes32 txId = getHash(_target, _value, _data, _timestamp);
        if (queueId[msg.sender][txId]) {
            revert AlreadyQueuedError(msg.sender, txId);
        }

        queueId[msg.sender][txId] = true;

        emit Queue(txId, _target, _value, _data, _timestamp);
    }

    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _timestamp
    ) external payable returns (bytes memory) {
        bytes32 txId = getHash(_target, _value, _data, _timestamp);
        if (!queueId[msg.sender][txId]) {
            revert NotExistQueuedError(msg.sender, txId);
        }
        (bool success, bytes memory data) = _target.call{value: _value}(_data);
        require(success);
        if (!success) {
            revert ExecuteError(txId);
        }
        queueId[msg.sender][txId] = false;
        emit Queue(txId, _target, _value, _data, _timestamp);
        return data;
    }

    function cancle(bytes32 txId) external {
        if (!queueId[msg.sender][txId]) {
            revert NotExistQueuedError(msg.sender, txId);
        }
        queueId[msg.sender][txId] = false;
        emit Cancle(msg.sender, txId);
    }

    function getTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}

// 此合约只能被时间锁合约操作
contract TestTimeLock {
    address public timeLock;

    error UnautorizedError(address caller);

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    function func1() external view returns (uint256, uint256) {
        if (msg.sender != timeLock) {
            revert UnautorizedError(msg.sender);
        }
        return (1, block.timestamp);
    }

    function getfunc1ABIData() external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.func1.selector);
    }
}
