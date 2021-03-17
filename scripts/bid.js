const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");
    const AUCTION_ADDRESS = process.env.AUCTION_ADDRESS;
    const WBTC_ADDRESS = process.env.WBTC_ADDRESS;

    const amount = "1000000000";

    const ERC20 = await ethers.getContractFactory("ERC20");
    const wbtc = ERC20.attach(WBTC_ADDRESS);
    try {
        const result = await wbtc.approve(AUCTION_ADDRESS, amount);
        console.log(`Approve at tx: ${result.hash}`);
    } catch (e) {
        console.log(e);
    }

    // const auction = KeeperAuction.attach(AUCTION_ADDRESS);
    // try {
    //     const result = await auction.bid(WBTC_ADDRESS, amount);
    //     console.log(`Auction ${process.env.AUCTION_ADDRESS} bid at tx: ${result.hash}`);
    // } catch (e) {
    //     console.log(e);
    // }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
