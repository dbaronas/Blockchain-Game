var MyToken = artifacts.require("./Poseidon.sol");

module.exports = function(deployer) {
  // Output to console or a configuration file
  console.log({
    MyToken: MyToken.address,
  });
};