// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 角色权限管理合约
contract AccessControl {
    event GrantRoleLog(bytes32 indexed role, address indexed account);
    event RevokeRoleLog(bytes32 indexed role, address indexed account);

    // role => account => bool
    mapping(bytes32 => mapping(address => bool)) public roles;

    // private变量比public变量更节约gas值
    // bytes32比string类型的变量节约gas值
    bytes32 private constant ADMIN = keccak256(abi.encodePacked("ADMIN"));
    bytes32 private constant USER = keccak256(abi.encodePacked("USER"));

    modifier onlyRole(bytes32 role) {
        require(roles[role][msg.sender] == true, "not authorized");
        _;
    }

    constructor() {
        _grantRole(ADMIN, msg.sender);
    }

    function _grantRole(bytes32 _role, address _account) internal {
        roles[_role][_account] = true;
        emit GrantRoleLog(_role, _account);
    }

    function grantRole(bytes32 _role, address _account)
        external
        onlyRole(ADMIN)
    {
        _grantRole(_role, _account);
    }

    function revokeRole(bytes32 _role, address _account)
        external
        onlyRole(ADMIN)
    {
        roles[_role][_account] = false;
        emit RevokeRoleLog(_role, _account);
    }
}
