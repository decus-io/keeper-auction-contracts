const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    const result = await auction.end([
        '0xce38eb60670e1c2b96b8f9413187d4e79ef7a79a',
        '0x347ba66e4d8bb18601ba03e2b32ceb22c8a8cbd8',
        '0x8984a423ce4bc23e97c1795ea11a56abecb1ee56',
        '0xf09b8dda559292111af945e91717da39eef34ade'
    ]);

    console.log(`Auction ${process.env.AUCTION_ADDRESS} ended at tx: ${result.hash}`);
}

main();