const Prey = artifacts.require("Prey");
const Reentrance = artifacts.require("Reentrance");



module.exports = async function (deployer) {

  await deployer.deploy(Prey);
  await deployer.deploy(Reentrance);
};
