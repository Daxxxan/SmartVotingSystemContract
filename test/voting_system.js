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
        it('Add candidate on unknown ballot should not work', async function () {
            let _ballotName = 'ioejrgojerigojoeigjr';
            let _candidateName = 'oiejrgoijergioj';
            truffleAssert.reverts(addCandidateToBallot(_ballotName, _candidateName));
        });

        it('Add candidate on ballot', async function () {
            let _ballotName = 'oneroegr';
            await createBallot(_ballotName, _accounts[0]);
            let _candidateName = 'candidate1';
            await addCandidateToBallot(_ballotName, _candidateName);

            let _ballotCandidates = await getBallotCandidatesName(_ballotName);
            assert.isTrue(_ballotCandidates.length === 1 && _ballotCandidates.includes(_candidateName));
        });

        it('Add candidate twice should not work', async function () {
            let _ballotName = 'rjeigoerg';
            await createBallot(_ballotName, _accounts[0]);
            let _candidateName = 'hhh';
            await addCandidateToBallot(_ballotName, _candidateName);
            truffleAssert.reverts(addCandidateToBallot(_ballotName, _candidateName));
        });

        it('Add two different candidates should work', async function () {
            let _ballotName = 'regh';
            await createBallot(_ballotName, _accounts[0]);
            let _candidateName = 'ezeez';
            let _candidateName2 = 'ezeezoooo';
            await addCandidateToBallot(_ballotName, _candidateName);
            await addCandidateToBallot(_ballotName, _candidateName2);
            let _ballotCandidates = await getBallotCandidatesName(_ballotName);
            assert.isTrue(_ballotCandidates.length === 2);
        });

        it('Opened ballot should not allow candidate inscription', async function () {
            let _ballotName = 'erojiger';
            let _candidateName = 'opkmazmj';
            await createBallot(_ballotName, _accounts[0]);
            await openBallotVotes(_ballotName);
            truffleAssert.reverts(addCandidateToBallot(_ballotName, _candidateName));
        });

        it('Enclosed ballot should not allow candidate inscription', async function () {
            let _ballotName = 'erojigezefr';
            let _candidateName = 'opkmazmeeej';
            await createBallot(_ballotName, _accounts[0]);
            await openBallotVotes(_ballotName);
            await closeBallotVotes(_ballotName);
            truffleAssert.reverts(addCandidateToBallot(_ballotName, _candidateName));
        });
    });

    describe('Vote', function () {
        describe('Vote', function () {
            it('Vote on opened ballot and single candidate should work', async function () {
                let _ballotName = "reigoeg";
                let _candidateName = "eirgoj";
                await createBallot(_ballotName, _accounts[0]);
                await addCandidateToBallot(_ballotName, _candidateName);
                await openBallotVotes(_ballotName);
                await vote(_ballotName, _candidateName, _accounts[1]);
                let ballot = await getBallot(_ballotName);
                let results = await getBallotCandidatesResult(_ballotName);
                assert.strictEqual(results.length, 1);
                assertCandidateResult(results[0], _candidateName, 1);
            });

            it('Vote on unknown ballot should not work', async function () {
                let _ballotName = "rigojier";
                let _candidateName = "erlgjpoegr";
                truffleAssert.reverts(vote(_ballotName, _candidateName, _accounts[1]));
            });

            it('Vote on existing ballot but unknown candidate should not work', async function () {
                let _ballotName = "rigojier";
                let _candidateName = "erlgjpoegr";
                await createBallot(_ballotName);
                await openBallotVotes(_ballotName);
                truffleAssert.reverts(vote(_ballotName, _candidateName, _accounts[1]));
            });

            it('Vote on created ballot should not work', async function () {
                let _ballotName = "rigojier";
                let _candidateName = "erlgjpoegr";
                await createBallot(_ballotName);
                await addCandidateToBallot(_ballotName, _candidateName);
                truffleAssert.reverts(vote(_ballotName, _candidateName, _accounts[1]));
            });

            it('Vote on closed ballot should not work', async function () {
                let _ballotName = "rigojier";
                let _candidateName = "erlgjpoegr";
                await createBallot(_ballotName);
                await addCandidateToBallot(_ballotName, _candidateName);
                await openBallotVotes(_ballotName);
                await closeBallotVotes(_ballotName);
                truffleAssert.reverts(vote(_ballotName, _candidateName, _accounts[1]));
            });
        });

        describe('Candidates results', function () {
            it('Get candidates result on single candidate with no votes', async function () {
                let _ballotName = 'eroeeeeeer';
                let _candidateName = 'opkmazmemmmm';
                await createBallot(_ballotName, _accounts[0]);
                await addCandidateToBallot(_ballotName, _candidateName);
                let results = await getBallotCandidatesResult(_ballotName);
                assert.isTrue(results.length === 1);
                assertCandidateResult(results[0], _candidateName, 0);
            });

            it('Get candidates result on two candidates with no votes', async function () {
                let _ballotName = 'eroeeeeeer';
                let _candidateName = 'opkmazmemmmm';
                let _candidateName2 = 'aozpjoi';
                await createBallot(_ballotName, _accounts[0]);
                await addCandidateToBallot(_ballotName, _candidateName);
                await addCandidateToBallot(_ballotName, _candidateName2);
                let results = await getBallotCandidatesResult(_ballotName);
                assert.isTrue(results.length === 2);
                assertCandidateResult(results[0], _candidateName, 0);
                assertCandidateResult(results[1], _candidateName2, 0);
            });

            it('Get candidates result on unknown ballot should not work', async function () {
                let _ballotName = 'eroegllg';
                truffleAssert.reverts(getBallotCandidatesResult(_ballotName));
            });
        });
    });

    function assertCandidateResult(_candidate, _name, _vote) {
        assert.strictEqual(_candidate.name, _name);
        assert.strictEqual(_candidate.vote, _vote);
    }

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

    async function getBallotCandidatesName(_ballotName) {
        let ballot = await getBallot(_ballotName);
        return ballot.candidatesName.map(candidate => web3.utils.hexToString(candidate))
    }

    async function vote(_ballotName, _candidateName, _voter) {
        let bytes32BallotName = convertStringToBytes32(_ballotName);
        let bytes32CandidateName = convertStringToBytes32(_candidateName);
        return await instance.voteForCandidate(bytes32BallotName, bytes32CandidateName, { from: _voter });
    }

    async function getBallotCandidatesResult(_ballotName) {
        let bytes32Name = convertStringToBytes32(_ballotName);
        let results = await instance.getCandidatesResult(bytes32Name);
        for (let i = 0; i < results.length; i++) {
            results[i].name = web3.utils.hexToString(results[i].name);
            results[i].vote = parseInt(results[i].vote);
        }
        return results;
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
