const MyToken = artifacts.require("./Poseidon.sol")

module.exports = function (deployer) {
    deployer.deploy(MyToken, 1000000000)
}