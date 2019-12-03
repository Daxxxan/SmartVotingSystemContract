const path = require('path');
const fs = require('fs');
const solc = require('solc');

const VotingSystemPath = path.resolve(__dirname, 'contracts', 'VotingSystem.sol');
const source = fs.readFileSync(VotingSystemPath, 'UTF-8');

module.exports = solc.compile(source, 1).contracts[':VotingSystem'];