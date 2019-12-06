//pragma solidity ^0.5.11;
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

contract VotingSystem {

    enum State {
        NOT_CREATED, //Default value & value given to unknown ballots
        CREATED, //Can add participants
        OPENED, //Can vote
        CLOSED //Can watch results
    }

    struct BallotExistence {
        uint id;
        bool exists;
    }

    struct Ballot {
        bytes32 name;
        State state;
        address owner;
    }

    Ballot[] public ballots;
    mapping(bytes32 => BallotExistence) ballotMapping;

//    modifier ballotExists(bytes32 _ballotName) {
//        BallotExistence memory existence = ballotMapping[_ballotName];
//        require(existence.exists == true);
//        _;
//    }

    modifier ownsBallot(bytes32 _ballotName) {
        require(getBallotByName(_ballotName).owner == msg.sender);
        _;
    }

    modifier isState(bytes32 _ballotName, State _state) {
        require(getBallotByName(_ballotName).state == _state);
        _;
    }

    function createBallot(bytes32 _ballotName) public {
        Ballot memory _newBallot = Ballot({
            name : _ballotName,
            state : State.CREATED,
            owner : msg.sender
            });

        uint _ballotId = ballots.push(_newBallot) - 1;
        ballotMapping[_ballotName] = BallotExistence({id: _ballotId, exists: true});
    }

    function openBallotVotes(bytes32 _ballotName) view public ownsBallot(_ballotName) isState(_ballotName, State.CREATED) {
        getBallotByName(_ballotName).state = State.OPENED;
    }

    function closeBallotVotes(bytes32 _ballotName) view public ownsBallot(_ballotName) isState(_ballotName, State.OPENED) {
        getBallotByName(_ballotName).state = State.CLOSED;
    }

    function getBallotByName(bytes32 _ballotName) internal view returns (Ballot memory) {
        uint _ballotId = ballotMapping[_ballotName].id;
        return ballots[_ballotId];
    }

    function getBallot(bytes32 _ballotName) view public returns (Ballot memory) {
        if(!ballotExists(_ballotName)) {
            return Ballot({
                name : _ballotName,
                state : State.NOT_CREATED,
                owner : 0
            });
        }

        uint ballotId = ballotMapping[_ballotName].id;
        return ballots[ballotId];
    }

    function isCreated(bytes32 _ballotName) view public returns (bool) {
        uint ballotId = ballotMapping[_ballotName].id;
        return ballots[ballotId].state == State.CREATED;
    }

    function getBallotId(bytes32 _ballotName) view public returns (uint) {
        return ballotMapping[_ballotName].id;
    }

    function isOpened(bytes32 _ballotName) view public returns (bool) {
        Ballot memory _ballot = getBallot(_ballotName);
        return _ballot.state == State.OPENED;
    }

    function ballotExists(bytes32 _ballotName) view internal returns (bool) {
        return ballotMapping[_ballotName].exists;
    }
}
