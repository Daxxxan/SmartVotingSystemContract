pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract SmartVotingSystemContract {

    enum Distinction { Bad, Mediocre, Inadequate, Passable, Good, VeryGood, Excellent }
    enum State {
        CREATED, //Can add participants
        OPENED, //Can vote
        CLOSED //Can watch results
    }

    struct Ballot {
        string name;
        Candidate[] candidates;
        address owner;
        address[] voters;
        State state;
    }

    struct Vote {
        string candidate;
        Distinction distinction;
    }

    struct Candidate {
        string name;
        uint[] votes;
    }

    Ballot[] public ballots;

    modifier ballotExists(uint _ballotId) {
        require(_ballotId < ballots.length);
        _;
    }

    modifier ownsBallot(uint _ballotId) {
        require(ballots[_ballotId].owner == msg.sender);
        _;
    }

    modifier isState(uint _ballotId, State _state) {
        require(ballots[_ballotId].state == _state);
        _;
    }

    modifier didntVote(uint _ballotId) {
        bool voted = false;
        for(uint i = 0; i < ballots[_ballotId].voters.length; i++) {
            if(ballots[_ballotId].voters[i] == msg.sender) {
                voted = true;
            }
        }

        require(voted == false);
        _;
    }

    function createBallot(string memory _name) public returns (uint) {
        ballots.length++;
        Ballot storage newBallot = ballots[ballots.length - 1];
        newBallot.name = _name;
        newBallot.owner = msg.sender;
        newBallot.state = State.CREATED;

        return ballots.length - 1;
    }

    function openBallotVotes(uint _ballotId) public ballotExists(_ballotId) ownsBallot(_ballotId) isState(_ballotId, State.CREATED) {
        ballots[_ballotId].state = State.OPENED;
    }

    function closeBallotVotes(uint _ballotId) public ballotExists(_ballotId) ownsBallot(_ballotId) isState(_ballotId, State.OPENED) {
        ballots[_ballotId].state = State.CLOSED;
    }

    function addCandidate(uint _ballotId, string[] memory _candidates) public ballotExists(_ballotId) ownsBallot(_ballotId) isState(_ballotId, State.CREATED) {
        for(uint i = 0; i < _candidates.length; i++) {
            ballots[_ballotId].candidates.length++;
            ballots[_ballotId].candidates[ballots[_ballotId].candidates.length - 1].name = _candidates[i];
        }
    }

    function vote(uint _ballotId, Vote[] memory _votes) public ballotExists(_ballotId) isState(_ballotId, State.OPENED) didntVote(_ballotId) {
        Ballot storage currentBallot = ballots[_ballotId];
        for(uint i = 0; i < _votes.length; i++) {
            uint candidatePosition = getCandidatePosition(_ballotId, _votes[i].candidate);
            if(candidatePosition == uint(-1)) {
                revert("Candidate does not exists.");
            }

            currentBallot.candidates[candidatePosition].votes[uint(_votes[i].distinction)]++;
        }

        currentBallot.voters.push(msg.sender);
    }

    function getResult(uint _ballotId) public view ballotExists(_ballotId) returns (Candidate[] memory) {
        return ballots[_ballotId].candidates;
    }





    function getCandidatePosition(uint _ballotId, string memory candidateName) view internal ballotExists(_ballotId) returns (uint) {
        Ballot memory ballot = ballots[_ballotId];
        for(uint i = 0; i < ballot.candidates.length; i++) {
            if(stringAreEquals(ballot.candidates[i].name, candidateName)) {
                return i;
            }
        }

        return uint(-1);
    }

    function stringAreEquals(string memory a, string memory b) pure internal returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }





    function watchBallots() public view returns (Ballot[] memory) {
        return ballots;
    }

    function watchBallot(uint _ballotId) public view returns (Ballot memory) {
        return ballots[_ballotId];
    }

    function getCandidates(uint _ballotId) public view returns (string[] memory) {
        uint candidatesLength = ballots[_ballotId].candidates.length;
        string[] memory candidatesName = new string[](candidatesLength);
        for(uint index = 0; index < candidatesLength; index++) {
            candidatesName[index] = ballots[_ballotId].candidates[index].name;
        }

        return candidatesName;
    }
}