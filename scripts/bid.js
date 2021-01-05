const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    try {
        const result = await auction.bid(
            "0xffa6d011a20ff3a302da0c4ca5713e234e7309af",
            "1000000000000000000"
        );
        console.log(`Auction ${process.env.AUCTION_ADDRESS} bid at tx: ${result.hash}`);
    } catch (e) {
        console.log(e);
    }
}

main();