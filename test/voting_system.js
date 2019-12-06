const web3 = require("web3");
var VotingSystem = artifacts.require("./VotingSystem");

contract("VotingSystem", function (_accounts) {
    let instance;

    before(async function () {
        instance = await VotingSystem.deployed();
    });

    it("should assert true", function (done) {
        assert.isTrue(true);
        done();
    });

    it("should create a ballot", async function () {
        let _ballotName = 'urgiherigherg';
        await createBallot(_ballotName, _accounts[0]);
        let _ballot = await getBallot(_ballotName);

        await assert.strictEqual(getBallotName(_ballot), _ballotName, "Created ballot name should be equal with the name provided");
    });

    it("should get an empty ballot", async function () {
        let _ballotName = 'iuhegrjpo';
        let _ballotId = await getBallotId(_ballotName);
        let _ballot = await getBallot(_ballotName);

        await assert.strictEqual(getBallotName(_ballot), _ballotName, "Getting an unknown ballot should return empty ballot");
        await assert.strictEqual(getBallotOwner(_ballot), 0, "Getting an unknown ballot should return empty ballot");
    });

    it("Freshly created ballot should have CREATED state", async function () {
        let _ballotName = 'righeiuehgr';
        await createBallot(_ballotName, _accounts[0]);
        let isCreated = await ballotIsCreated(_ballotName);

        await assert.isTrue(isCreated, "Created ballot state should be CREATED");
    });

    it("Unknown ballot should not have CREATED state", async function () {
        let _ballotName = 'eurbgiher';
        let isCreated = await ballotIsCreated(_ballotName);

        await assert.isFalse(isCreated, "Unknown ballot state should not be CREATED");
    });

    // it("should have OPENED state", async function () {
    //     let _ballotName = 'righeiuehgr';
    //     await createBallot(_ballotName, _accounts[0]);
    //     await openBallotVotes(_ballotName);
    //
    //     await assert.isTrue(ballotIsOpened(_ballotName), "Opened ballot state should be OPENED");
    // });


    async function createBallot(_ballotName, _ballotOwner) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        await instance.createBallot(bytes32Name, {from: _ballotOwner});
    }

    async function getBallot(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.getBallot(bytes32Name);
    }

    async function getBallotId(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.getBallotId(bytes32Name);
    }

    async function openBallotVotes(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.openBallotVotes(bytes32Name);
    }

    function ballotIsCreated(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return instance.isCreated(bytes32Name);
    }

    async function ballotIsOpened(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.isOpened(bytes32Name);
    }

    function getBallotName(_ballot) {
        return web3.utils.hexToString(_ballot.name);
    }

    function getBallotOwner(_ballot) {
        return web3.utils.hexToNumber(_ballot.owner);
    }

    function getBallotState(_ballot) {
        return parseInt(_ballot.state);
    }

    function convertStringToBytes32(_string) {
        return web3.utils.fromAscii(_string);
    }

});