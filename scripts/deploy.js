const { ethers, upgrades } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = await upgrades.deployProxy(KeeperAuction, [
        ["0xffa6d011a20ff3a302da0c4ca5713e234e7309af", "0x13c39be3d5250bec24b29c3962379e0869893565"],
        300,
        1000
    ], {unsafeAllowCustomTypes: true});
    await auction.deployed();
    console.log("KeeperAuction deployed to:", auction.address);
}

main();