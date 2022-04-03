const ReceiveEther = artifacts.require("ReceiveEther");
const SendEther = artifacts.require("SendEther");



module.exports = async function (deployer) {

  await deployer.deploy(ReceiveEther);
  await deployer.deploy(SendEther);
};
