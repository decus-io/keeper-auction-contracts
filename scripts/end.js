const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    const result = await auction.end([
        '0x8984a423ce4bc23e97c1795ea11a56abecb1ee56',
        '0x347ba66e4d8bb18601ba03e2b32ceb22c8a8cbd8',
        '0x160114085f451a2d19389cc4cf6f20a803770cbf'
    ]);

    console.log(`Auction ${process.env.AUCTION_ADDRESS} ended at tx: ${result.hash}`);
}

main();