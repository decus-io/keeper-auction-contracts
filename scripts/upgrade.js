const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

async function main() {
  const KeeperAuction = await ethers.getContractFactory("KeeperAuction");
  const auction = await upgrades.upgradeProxy(process.env.AUCTION_ADDRESS, KeeperAuction);
  console.log("KeeperAuction upgraded");
}

main();