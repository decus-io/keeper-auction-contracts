const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);

    console.log("KeeperAuction deadline:", (await auction.deadline()).toString());
    console.log("KeeperAuction ended:", await auction.ended());

    console.log("KeeperAuction bid count:", (await auction.bidCount()).toString());
    console.log("KeeperAuction biddable:", await auction.biddable());
    console.log("KeeperAuction withdrawable:", await auction.withdrawable());
    console.log(
        "KeeperAuction bidderAmount:",
        (await auction.bidderAmount("0x8984a423ce4bc23e97c1795ea11a56abecb1ee56")).toString()
    );
    console.log(
        "KeeperAuction userBidsIndex:",
        (await auction.userBidsIndex("0x8984a423ce4bc23e97c1795ea11a56abecb1ee56")).toString()
    );
    console.log("KeeperAuction cancelable:", await auction.cancelable(0));

    const bidCount = await auction.bidCount();

    for (let i = 0; i < bidCount; i++) {
        logBid(await auction.getBid(i));
    }
}

function logBid(bid) {
    console.log(`Bid: {
      owner: ${bid.owner},
      live: ${bid.live},
      index: ${bid.index.toString()},
      token: ${bid.token},
      amount: ${bid.amount.toString()},
      vAmount: ${bid.vAmount.toString()},
      selectedAmount: ${bid.selectedAmount.toString()},
  }`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
