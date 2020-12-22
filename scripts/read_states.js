const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach("0xBf5413513343578E28A1241E78acB0458EBD1454");
    
    console.log("KeeperAuction deadline:", (await auction.deadline()).toString());
}

main();