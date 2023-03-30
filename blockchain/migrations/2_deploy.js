const Token = artifacts.require('PoseidonToken')
const NFT = artifacts.require('PoseidonNFT')
const GameItem = artifacts.require('GameItem')
const Market = artifacts.require('PoseidonMarket')

module.exports = async function (deployer) {
    await deployer.deploy(Market)
    const market = await Market.deployed()
    await deployer.deploy(Token, market.address)
    const token = await Token.deployed()
    await market.setCurrency(token.address)
    await deployer.deploy(NFT, market.address)
    //deployer.deploy(GameItem, market.address)
}