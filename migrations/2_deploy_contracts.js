let VotingSystem = artifacts.require("./VotingSystem.sol");
let CrowdFunding = artifacts.require("./CrowdFunding.sol");
module.exports = function(deployer) {
    deployer.deploy(VotingSystem, 'voting system name');
    deployer.deploy(CrowdFunding, 'test contract');
};
