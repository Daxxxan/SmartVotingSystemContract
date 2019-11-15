let SmartVotingSystemContract = artifacts.require("./SmartVotingSystemContract.sol");
module.exports = function(deployer) {
    deployer.deploy(SmartVotingSystemContract);
};
