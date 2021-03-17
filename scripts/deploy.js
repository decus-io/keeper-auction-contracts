const { ethers, upgrades } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = await upgrades.deployProxy(
        KeeperAuction,
        [[process.env.WBTC_ADDRESS], 300, process.env.MIN_SATOSHI],
        { unsafeAllowCustomTypes: true }
    );
    await auction.deployed();
    console.log("KeeperAuction deployed to:", auction.address);
}

main();
