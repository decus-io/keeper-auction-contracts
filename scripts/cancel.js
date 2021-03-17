const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);

    const result = await auction.cancel(0);

    console.log(`Auction ${process.env.AUCTION_ADDRESS} canceled at tx: ${result.hash}`);
}

main();
