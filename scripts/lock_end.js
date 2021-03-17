const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    const KeeperImportAddr = process.env.KEEPER_IMPORT_ADDRESS;
    const DeadLine = process.env.LOCK_DEADLINE;

    const overrides = {
        gasLimit: 1000000,
        gasPrice: "1000000000",
        value: ethers.utils.parseEther("0"),
    };

    console.log(`Keeper Import Address ${KeeperImportAddr} Deadline ${DeadLine}`);

    const result = await auction.lockEnd(
        KeeperImportAddr,
        DeadLine
        // overrides
    );

    console.log(`Auction ${process.env.AUCTION_ADDRESS} locked at tx: ${result.hash}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
