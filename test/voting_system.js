const web3 = require("web3");
const truffleAssert = require('truffle-assertions');
let VotingSystem = artifacts.require("./VotingSystem");

contract("VotingSystem", async function (_accounts) {
    let instance;

    before(async function () {
        instance = await VotingSystem.deployed();
    });

    describe('Ballot creation', function () {
        it("should create a ballot", async function () {
            let _ballotName = 'urgiherigherg';
            await createBallot(_ballotName, _accounts[0]);
            let _ballot = await getBallot(_ballotName);

            await assert.strictEqual(getBallotName(_ballot), _ballotName, "Created ballot name should be equal with the name provided");
        });
    });

    describe('Getting ballot', function () {
        it("should revert when getting an unknown ballot", async function () {
            let _ballotName = 'iuhegrjpo';
            truffleAssert.reverts(getBallot(_ballotName));
        });
    });

    describe('States tests', function () {
        describe('CREATED state', function () {
            it("Unknown ballot should not have CREATED state", async function () {
                let _ballotName = 'eurbgiher';
                truffleAssert.reverts(ballotIsCreated(_ballotName));
            });

            it("Freshly created ballot should have CREATED state", async function () {
                let _ballotName = 'righeiuehgrzee';
                await createBallot(_ballotName, _accounts[0]);

                await assert.isTrue(await ballotIsCreated(_ballotName));
            });

            it("Opened ballot should not have CREATED state", async function () {
                let _ballotName = 'ergojp';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);

                await assert.isFalse(await ballotIsCreated(_ballotName));
            });

            it("Enclosed ballot should not have CREATED state", async function () {
                let _ballotName = 'ergoergpojjp';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);
                await closeBallotVotes(_ballotName);

                await assert.isFalse(await ballotIsCreated(_ballotName));
            });
        });

        describe('OPENED state', function () {
            it("Unknown ballot should not have OPENED state", async function () {
                let _ballotName = 'erpgoj';
                truffleAssert.reverts(ballotIsOpened(_ballotName));
            });

            it("Freshly created ballot should not have OPENED state", async function () {
                let _ballotName = 'azdpkog';
                await createBallot(_ballotName, _accounts[0]);

                await assert.isFalse(await ballotIsOpened(_ballotName));
            });

            it("Opened ballot should have OPENED state", async function () {
                let _ballotName = 'azepokgp';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);

                await assert.isTrue(await ballotIsOpened(_ballotName));
            });

            it("Enclosed ballot should not have OPENED state", async function () {
                let _ballotName = 'azenvb';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);
                await closeBallotVotes(_ballotName);

                await assert.isFalse(await ballotIsOpened(_ballotName));
            });
        });

        describe('ENCLOSED state', function () {
            it("Unknown ballot should not have ENCLOSED state", async function () {
                let _ballotName = 'azeqsd';
                truffleAssert.reverts(ballotIsEnclosed(_ballotName));
            });

            it("Freshly created ballot should have ENCLOSED state", async function () {
                let _ballotName = 'aaaaaaaa';
                await createBallot(_ballotName, _accounts[0]);

                await assert.isFalse(await ballotIsEnclosed(_ballotName));
            });

            it("Opened ballot should not have ENCLOSED state", async function () {
                let _ballotName = 'poergbz';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);

                await assert.isFalse(await ballotIsEnclosed(_ballotName));
            });

            it("Enclosed ballot should have ENCLOSED state", async function () {
                let _ballotName = 'azekvbevqh';
                await createBallot(_ballotName, _accounts[0]);
                await openBallotVotes(_ballotName);
                await closeBallotVotes(_ballotName);

                await assert.isTrue(await ballotIsEnclosed(_ballotName));
            });
        });
    });

    describe('Candidates', function () {
        it('Add candidate on ballot', async function () {
            let _ballotName = 'oneroegr';
            await createBallot(_ballotName, _accounts[0]);
            let _candidateName = 'candidate1';
            await addCandidateToBallot(_ballotName, _candidateName);

            let _ballotCandidates = await getBallotCandidates(_ballotName);
            assert.isTrue(_ballotCandidates.length === 1 && _ballotCandidates.includes(_candidateName));
        });

        it('Add candidate twice should not work', async function () {
            let _ballotName = 'rjeigoerg';
            await createBallot(_ballotName, _accounts[0]);
            let _candidateName = 'eirho';
            await addCandidateToBallot(_ballotName, _candidateName);
            await addCandidateToBallot(_ballotName, _candidateName);

            let _ballotCandidates = await getBallotCandidates(_ballotName);
            truffleAssert.reverts(addCandidateToBallot(_ballotName, _candidateName));
            // assert.isTrue(false);

        })
    });

    it('test', async function () {
       let a = web3.utils.stringToHex("hello world");
       let b = web3.utils.stringToHex("hello world");
       let result = await instance.testEquality(a, b);

       assert.isTrue(result);
    });

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

    async function closeBallotVotes(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.closeBallotVotes(bytes32Name);
    }

    function ballotIsCreated(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return instance.isCreated(bytes32Name);
    }

    async function ballotIsOpened(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.isOpened(bytes32Name);
    }

    async function ballotIsEnclosed(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        return await instance.isEnclosed(bytes32Name);
    }

    async function addCandidateToBallot(_ballotName, _candidateName) {
        let bytes32BallotName = convertStringToBytes32(_ballotName);
        let bytes32CandidateName = convertStringToBytes32(_candidateName);
        return await instance.addCandidate(bytes32BallotName, bytes32CandidateName);
    }

    async function getBallotCandidates(_ballotName) {
        let ballot = await getBallot(_ballotName);
        return ballot.candidatesName.map(candidate => web3.utils.hexToString(candidate))
    }

    function getBallotName(_ballot) {
        return web3.utils.hexToString(_ballot.name);
    }

    function getBallotOwner(_ballot) {
        return web3.utils.hexToNumber(_ballot.owner);
    }

    function convertStringToBytes32(_string) {
        return web3.utils.fromAscii(_string);
    }
});
