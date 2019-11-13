pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract SmartVotingSystem {
    
    struct Ballot {
        string name;
        string[] candidates;
        address owner;
    }
    
    Ballot[] public ballots;
    
    modifier ownsBallot(uint _ballotId) {
        require(ballots[_ballotId].owner == msg.sender);
        _;
    }
    
    function createBallot(string memory _name) public returns (uint) {
        return ballots.push(Ballot(_name, new string[](0), msg.sender)) - 1;
    }
    
    function watchBallots() public view returns (Ballot[] memory) {
        return ballots;
    }
    
    function watchBallot(uint _ballotId) public view returns (Ballot memory) {
        return ballots[_ballotId];
    }
    
    function addCandidate(uint _ballotId, string[] memory _candidates) public ownsBallot(_ballotId) {
        for(uint i = 0; i < _candidates.length; i++) {
            ballots[_ballotId].candidates.push(_candidates[i]);
        }
    }
}