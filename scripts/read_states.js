const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach("0xBf5413513343578E28A1241E78acB0458EBD1454");
    
    console.log("KeeperAuction deadline:", (await auction.deadline()).toString());

    const bid0 = await auction.getBid(0);
    console.log(`Bid 0: {
        owner: ${bid0.owner},
        live: ${bid0.live},
        index: ${bid0.index.toString()},
        token: ${bid0.token},
        amount: ${bid0.amount.toString()},
        vAmount: ${bid0.vAmount.toString()},
        selectedAmount: ${bid0.selectedAmount.toString()},
    }`);
}

main();