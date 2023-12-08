const path = require("path");
const programDir = path.join(__dirname, "..", "programs", "cubik");
const idlDir = path.join(__dirname, "idl");
const sdkDir = path.join(__dirname, "src", "generated");
const binaryInstallDir = path.join("$HOME/.cargo");

module.exports = {
  idlGenerator: "anchor",
  programName: "cubik",
  programId: "3o5FHxJVuU39wv7VSaYdewPosHLQzZGvPtdwnU4qYBiS",
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};
