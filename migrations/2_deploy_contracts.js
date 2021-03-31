const DIPI = artifacts.require("DIPI");
const GDIPI = artifacts.require("GDIPI");
const EDIPI = artifacts.require("EDIPI");
const MasterChef = artifacts.require("MasterChef");
const Multicall = artifacts.require("Multicall");
const RateOracle = artifacts.require("RateOracle");
const MockBEP20 = artifacts.require("MockBEP20");
const WBNB = artifacts.require("WBNB");

const IBSCswapFactory = artifacts.require("IBSCswapFactory");

const createMockTokens = async (deployer, dipi, masterChef) => {
//     DIPI/BNB (Binance-Peg Binance)
// DIPI/BUSD (Binance-Peg USD)
// DIPI/BTCB (Binance-Peg Bitcoin)
// DIPI/ETHB (Binance-Peg Ethereum)
// DIPI/ETH
// DIPI/CAKE (BEP20 Pancake)
    await deployer.deploy(MockBEP20,'BUSD','BUSD', web3.utils.toWei('1000000'))
    const busd = await MockBEP20.deployed()
    console.log('busd:' + busd.address)
    await deployer.deploy(MockBEP20,'BTCB','BTCB', web3.utils.toWei('1000000'))
    const btcb = await MockBEP20.deployed()
    console.log('btcb:' + btcb.address)
    
    await deployer.deploy(MockBEP20,'ETHB','ETHB', web3.utils.toWei('1000000'))
    const ethb = await MockBEP20.deployed()
    console.log('ethb:' + ethb.address)
    await deployer.deploy(MockBEP20,'ETH','ETH', web3.utils.toWei('1000000'))
    const eth = await MockBEP20.deployed()
    console.log('eth:' + eth.address)

    await deployer.deploy(MockBEP20,'CAKE','CAKE', web3.utils.toWei('1000000'))
    const cake = await MockBEP20.deployed()
    console.log('cake:' + cake.address)

    const wbnb = await WBNB.at('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd')
    const factory = await IBSCswapFactory.at('0xCe8fd65646F2a2a897755A1188C04aCe94D2B8D0')

    await factory.createPair(wbnb.address, dipi.address)
    await factory.createPair(busd.address, dipi.address)
    await factory.createPair(btcb.address, dipi.address)
    await factory.createPair(ethb.address, dipi.address)
    await factory.createPair(eth.address, dipi.address)
    await factory.createPair(cake.address, dipi.address)

    const wbnbPair = await factory.getPair(wbnb.address, dipi.address)
    console.log('wbnbPair'+wbnbPair.address)
    const busdPair = await factory.getPair(busd.address, dipi.address)
    console.log('busdPair'+busdPair.address)
    const btcbPair = await factory.getPair(btcb.address, dipi.address)
    console.log('btcbPair'+btcbPair.address)
    const ethbPair = await factory.getPair(ethb.address, dipi.address)
    console.log('ethbPair'+ethbPair.address)
    const ethPair = await factory.getPair(eth.address, dipi.address)
    console.log('ethPair'+ethPair.address)
    const cakePair = await factory.getPair(cake.address, dipi.address)
    console.log('cakePair'+cakePair.address)

    await masterChef.add('1000', wbnbPair, false)
    await masterChef.add('1000', busdPair, false)
    await masterChef.add('1000', btcbPair, false)
    await masterChef.add('1000', ethbPair, false)
    await masterChef.add('1000', ethPair, false)
    await masterChef.add('1000', cakePair, false)    
}
module.exports = async function (deployer, networks, accounts) {
    await deployer.deploy(Multicall)
    await deployer.deploy(DIPI)
    await deployer.deploy(RateOracle)
    const dipi = await DIPI.deployed()
    const rateOracle = await RateOracle.deployed()
    await dipi.mint(accounts[0], web3.utils.toWei('100000'))
    await deployer.deploy(GDIPI, dipi.address)
    const gdipi = await GDIPI.deployed()


    await deployer.deploy(EDIPI, dipi.address)
    const edipi = await EDIPI.deployed()


    const devaddr = accounts[0]
    await gdipi.mint(devaddr, web3.utils.toWei('100000'))
    const dipiPerBlock = web3.utils.toWei('10')
    const startBlock = 6950000

    await deployer.deploy(MasterChef, dipi.address,gdipi.address, edipi.address, rateOracle.address, devaddr,dipiPerBlock, startBlock)

    const masterChef = await MasterChef.deployed()

    await createMockTokens(deployer, dipi, masterChef)
    await dipi.transferOwnership(masterChef.address)
    await gdipi.transferOwnership(masterChef.address)
    await edipi.transferOwnership(masterChef.address)
};
