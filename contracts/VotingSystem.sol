pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract VotingSystem {

    struct Ballot {
        string name;
    }

    Ballot[] public ballots;
    mapping(string => uint) ballotMapping;

    function createBallot(string memory _ballotName) public {
        Ballot memory _newBallot = Ballot({
            name: _ballotName
        });

        uint _ballotId = ballots.push(_newBallot);
        ballotMapping[_ballotName] = _ballotId;
    }

    function watchBallot(string memory _ballotName) view public returns (uint ballotId) {
        ballotId = ballotMapping[_ballotName];
//        return ballots[ballotId];
    }
}
