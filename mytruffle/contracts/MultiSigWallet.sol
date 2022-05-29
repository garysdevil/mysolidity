// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiSigWallet {
    event DepositLog(address indexed sender, uint256 amount);
    event SubmitLog(uint256 indexed txId);
    event ApproveLog(address indexed owner, uint256 indexed txId);
    event RevokeLog(address indexed owner, uint256 indexed txId);
    event ExecuteLog(uint256 indexed txId);

    struct Transaction {
        // 制定交易的数据结构
        address to;
        uint256 amount;
        bytes data;
        bool executed;
    }
    address[] public owners; // 记录所有的签名人。
    mapping(address => bool) public isOwner; // 记录地址是否是签名人。
    uint256 public requiredApprove; // 记录一笔transaction需要多少位签名人进行签名。

    Transaction[] public transactions; // 记录所有的交易，在提交交易、执行交易时需要用到。
    mapping(uint256 => mapping(address => bool)) public approved; // 记录签名人是否对transaction进行了签名。

    // 部署参数示例： ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"] 2
    constructor(address[] memory _owners, uint256 _requiredApprove) payable {
        require(_owners.length > 0, "owners required");
        require(
            _requiredApprove > 0 && _requiredApprove <= _owners.length,
            "invalid required number of owners"
        );

        for (uint256 i; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "has existed this owner");
            owners.push(owner);
            isOwner[owner] = true;
        }
        requiredApprove = _requiredApprove;
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }
    modifier txExists(uint256 _txId) {
        require(_txId < transactions.length, "");
        _;
    }
    modifier notApproved(uint256 _txId) {
        require(
            !approved[_txId][msg.sender],
            "you have approved this transaction"
        );
        _;
    }
    modifier notExecuted(uint256 _txId) {
        require(
            !transactions[_txId].executed,
            "this transaction has been executed"
        );
        _;
    }

    receive() external payable {
        emit DepositLog(msg.sender, msg.value);
    }

    // 执行示例参数 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db 2 0x
    function submit(
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) external onlyOwner {
        transactions.push(
            Transaction({
                to: _to,
                amount: _amount,
                data: _data,
                executed: false
            })
        );
        emit SubmitLog(transactions.length - 1);
    }

    function approve(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notApproved(_txId)
        notExecuted(_txId)
    {
        approved[_txId][msg.sender] = true;
        emit ApproveLog(msg.sender, _txId);
    }

    function revoke(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(
            approved[_txId][msg.sender],
            "this transaction has not been approved"
        );
        approved[_txId][msg.sender] = false;
        emit RevokeLog(msg.sender, _txId);
    }

    function _getApproved(uint256 _txId) internal view returns (uint256 count) {
        for (uint256 i; i < owners.length; i++) {
            if (approved[_txId][owners[i]] == true) {
                count += 1;
            }
        }
    }

    function execute(uint256 _txId)
        external
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(
            _getApproved(_txId) >= requiredApprove,
            "approvals < requiredApprove"
        );
        Transaction storage transaction = transactions[_txId];

        transaction.executed = true;

        (bool success, ) = transaction.to.call{value: transaction.amount}(
            abi.encodePacked(transaction.data)
        );
        require(success, "transaction executed fail");

        emit ExecuteLog(_txId);
    }
}
