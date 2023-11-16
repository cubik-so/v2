const path = require('path');
const programDir = path.join(__dirname, '..', 'programs', 'v2');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'anchor',
  programName: 'cubik_v2',
  programId: '3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS',
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};