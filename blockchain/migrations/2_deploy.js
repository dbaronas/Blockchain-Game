const Token = artifacts.require('PoseidonToken')
const NFT = artifacts.require('PoseidonNFT')
const GameItem = artifacts.require('GameItem')
const PoseidonMarket = artifacts.require('PoseidonMarket')

module.exports = async function (deployer) {
    deployer.deploy(Token)
    deployer.deploy(NFT)
    //deployer.deploy(GameItem)
    deployer.deploy(PoseidonMarket)
}