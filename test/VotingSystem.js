const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const VotingSystemContract = artifacts.require("VotingSystem.sol");

contract('VotingSystem', ([owner]) => {

    let votingSystem;

    beforeEach("Setup every test", async () => {
        votingSystem = await VotingSystemContract.new(owner);
    });

    it("should be true", async () => {
        assert.strictEqual(1, 1, "1 should be equal to 1");
    });

    it("should be false", async () => {
        assert.notStrictEqual(1, 2, "1 should not be equal to 2");
    });

    it("ballots created should have differents id", async () => {
        let _name = 'yruegighirgheueh';

        let createBallotBlock = await votingSystem.createBallot(_name, {from: owner});
        let ballotId = await votingSystem.watchBallot(_name);

        let _name2 = 'eirgo';

        let createBallotBlock2 = await votingSystem.createBallot(_name2, {from: owner});
        let ballotId2 = await votingSystem.watchBallot(_name2);


        assert.notStrictEqual(1, 2, "1 should not be equal to 2");
    });
});