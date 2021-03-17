const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);

    const overrides = {
        // gasLimit: 1000000,
        // gasPrice: "1000000000",
        // value: ethers.utils.parseEther("0"),
    };

    try {
        const result = await auction.fail(overrides);
        console.log(`Auction ${process.env.AUCTION_ADDRESS} ended at tx: ${result.hash}`);
    } catch (e) {
        console.log(e.stack);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
