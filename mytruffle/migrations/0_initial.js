const MyERC20 = artifacts.require("MyERC20");

const MerkleProof_1 = artifacts.require("MerkleProof_1");
const MerkleProof_2 = artifacts.require("MerkleProof_2");



module.exports = async function (deployer) {
  await deployer.deploy(MyERC20,'DOG','dog');

  await deployer.deploy(MerkleProof_1);
  await deployer.deploy(MerkleProof_2);
};
