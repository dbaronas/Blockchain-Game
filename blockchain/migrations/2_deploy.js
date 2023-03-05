const Token = artifacts.require('Poseidon')
const NFT = artifacts.require('PoseidonNFT')
const GameItem = artifacts.require('GameItem')

module.exports = async function (deployer) {
    deployer.deploy(Token)
    deployer.deploy(NFT)
    deployer.deploy(GameItem)
}