pragma solidity ^0.8.0;

contract MerkleProof_1 {
  // 传2个参数，证明和叶子节点。
  function verify( bytes32 leaf, bytes32[] memory proof ) public pure returns (bool){
    // 将默克尔树的根节点存在链上
    bytes32 root = 0xc9590c9453dec940c241031caddec8b677d2716056b9fe079739083a93a08fcf;
    bytes32 computedHash = leaf;

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash < proofElement) {
        // Hash(current computed hash + current element of the proof)
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        // Hash(current element of the proof + current computed hash)
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }

    // Check if the computed hash (root) is equal to the provided root
    return computedHash == root;
  }
}

contract MerkleProof_2 {
  // 传1个参数，证明。调用合约的地址为叶子节点。
  function verify( bytes32[] memory proof ) public view returns (bool){
    // 将默克尔树的根节点存在链上
    bytes32 root = 0xc9590c9453dec940c241031caddec8b677d2716056b9fe079739083a93a08fcf;
    bytes32 computedHash = keccak256(abi.encode(msg.sender));

    for (uint256 i = 0; i < proof.length; i++) {
      bytes32 proofElement = proof[i];

      if (computedHash < proofElement) {
        // Hash(current computed hash + current element of the proof)
        computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
      } else {
        // Hash(current element of the proof + current computed hash)
        computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
      }
    }

    // Check if the computed hash (root) is equal to the provided root
    return computedHash == root;
    // return keccak256(abi.encodePacked(msg.sender));
  }
}