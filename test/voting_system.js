const web3 = require("web3");
var VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem", function(_accounts) {
  it("should assert true", function(done) {
    VotingSystem.deployed();
    assert.isTrue(true);
    done();
  });

  it("should create a ballot", async function() {
    let name = 'urgiherigherg';
    let bytes32Name = web3.utils.fromAscii(name);

    let instance = await VotingSystem.deployed();
    await instance.createBallot(bytes32Name, {from: _accounts[0]});
    let ballot = await instance.getBallot(bytes32Name);

    await assert.strictEqual(web3.utils.hexToString(ballot), name, "Created ballot name should be equal with the name provided");
  })
});