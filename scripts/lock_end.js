const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    const result = await auction.lockEnd(
        process.env.KEEPER_IMPORT_ADDRESS,
        process.env.LOCK_DEADLINE
    );

    console.log(`Auction ${process.env.AUCTION_ADDRESS} locked at tx: ${result.hash}`);
}

main();