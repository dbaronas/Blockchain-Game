const Box = artifacts.require('Box');
const Poseidon = artifacts.require('Poseidon')

module.exports = async function (deployer) {
    await deployer.deploy(Poseidon)
    await deployer.deploy(Box);
};