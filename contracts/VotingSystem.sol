//pragma solidity ^0.5.11;
pragma solidity ^0.4.25;
pragma experimental ABIEncoderV2;

contract VotingSystem {

    enum State {
        NOT_CREATED, //Default value & value given to unknown ballots
        CREATED, //Can add participants
        OPENED, //Can vote
        ENCLOSED //Can watch results
    }

    struct BallotExistence {
        uint id;
        bool exists;
    }

    struct Ballot {
        bytes32 name;
        State state;
        address owner;
        bytes32[] candidatesName;
    }

    Ballot[] public ballots;
    mapping(bytes32 => BallotExistence) ballotMapping;

    modifier ballotExists(bytes32 _ballotName) {
        BallotExistence memory existence = ballotMapping[_ballotName];
        require(existence.exists == true);
        _;
    }

    modifier ownsBallot(bytes32 _ballotName) {
        require(getBallotByName(_ballotName).owner == msg.sender);
        _;
    }

    modifier isState(bytes32 _ballotName, State _state) {
        require(getBallotByName(_ballotName).state == _state);
        _;
    }

    modifier isNotAlreadyCandidate(bytes32 _ballotName, bytes32 _candidateName) {
        Ballot memory _ballot = getBallotByName(_ballotName);
        for(uint i = 0; i < _ballot.candidatesName.length; i++) {
            require(_ballot.candidatesName[i] !=_candidateName );
        }
        _;
    }

    function createBallot(bytes32 _ballotName) public {
        Ballot memory _newBallot = Ballot({
            name : _ballotName,
            state : State.CREATED,
            owner : msg.sender,
            candidatesName : new bytes32[](0)
            });

        uint _ballotId = ballots.push(_newBallot) - 1;
        ballotMapping[_ballotName] = BallotExistence({id : _ballotId, exists : true});
    }

    function openBallotVotes(bytes32 _ballotName) public ballotExists(_ballotName) ownsBallot(_ballotName) isState(_ballotName, State.CREATED) {
        getStorageBallot(_ballotName).state = State.OPENED;
    }

    function closeBallotVotes(bytes32 _ballotName) public ballotExists(_ballotName) ownsBallot(_ballotName) isState(_ballotName, State.OPENED) {
        getStorageBallot(_ballotName).state = State.ENCLOSED;
    }

    function getBallotByName(bytes32 _ballotName) internal view returns (Ballot memory) {
        uint _ballotId = ballotMapping[_ballotName].id;
        return ballots[_ballotId];
    }

    function getBallot(bytes32 _ballotName) view public ballotExists(_ballotName) returns (Ballot memory) {
        uint ballotId = ballotMapping[_ballotName].id;
        return ballots[ballotId];
    }

    function getStorageBallot(bytes32 _ballotName) view internal ballotExists(_ballotName) returns (Ballot storage) {
        uint ballotId = ballotMapping[_ballotName].id;
        return ballots[ballotId];
    }

    function getBallotId(bytes32 _ballotName) view public returns (uint) {
        return ballotMapping[_ballotName].id;
    }

    function isCreated(bytes32 _ballotName) view public ballotExists(_ballotName) returns (bool) {
        uint ballotId = ballotMapping[_ballotName].id;
        return ballots[ballotId].state == State.CREATED;
    }

    function isOpened(bytes32 _ballotName) view public ballotExists(_ballotName) returns (bool) {
        Ballot memory _ballot = getBallot(_ballotName);
        return _ballot.state == State.OPENED;
    }

    function isEnclosed(bytes32 _ballotName) view public ballotExists(_ballotName) returns (bool) {
        Ballot memory _ballot = getBallot(_ballotName);
        return _ballot.state == State.ENCLOSED;
    }

    function addCandidate(bytes32 _ballotName, bytes32 _candidateName) public ballotExists(_ballotName) isNotAlreadyCandidate(_ballotName, _candidateName){
        Ballot storage _ballot = getStorageBallot(_ballotName);
        _ballot.candidatesName.push(_candidateName);
    }

    function testEquality(bytes32 a, bytes32 b) public pure returns (bool) {
        return a == b;
    }
}
