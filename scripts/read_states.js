const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    console.log("KeeperAuction deadline:", (await auction.deadline()).toString());

    console.log("KeeperAuction bid count:", (await auction.bidCount()).toString());
    console.log("KeeperAuction biddable:", (await auction.biddable()));
    console.log("KeeperAuction withdrawable:", (await auction.withdrawable()));
    console.log("KeeperAuction cancelable:", (await auction.cancelable(0)));
    console.log("KeeperAuction bidderAmount:", (await auction.bidderAmount('0x8984a423ce4bc23e97c1795ea11a56abecb1ee56')).toString());
    console.log("KeeperAuction userBidsIndex:", (await auction.userBidsIndex('0x8984a423ce4bc23e97c1795ea11a56abecb1ee56')).toString());

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