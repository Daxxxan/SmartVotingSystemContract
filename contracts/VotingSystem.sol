//pragma solidity ^0.5.11;
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

contract VotingSystem {

    struct Ballot {
        bytes32 name;
    }

    Ballot[] public ballots;
    mapping(bytes32 => uint) ballotMapping;

    function createBallot(bytes32 _ballotName) public {
        Ballot memory _newBallot = Ballot({
            name: _ballotName
        });

        uint _ballotId = ballots.push(_newBallot) - 1;
        ballotMapping[_ballotName] = _ballotId;

//        uint id = ballots.push(Ballot(_ballotName)) - 1;
//        ballotMapping[_ballotName] = id;
    }

    function getBallot(bytes32 _ballotName) view public returns (bytes32) {
        uint ballotId = ballotMapping[_ballotName];
        return ballots[ballotId].name;
//
//        Ballot storage  ballot = ballots[ballotId];
//        return (ballot.name);
    }
}
