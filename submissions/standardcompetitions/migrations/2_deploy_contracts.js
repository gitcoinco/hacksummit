var StandardCompetitions = artifacts.require("../contracts/StandardCompetitions.sol");

module.exports = function(deployer) {
  deployer.deploy(StandardCompetitions, "0x0000000000000000000000000000000000000000");
};
