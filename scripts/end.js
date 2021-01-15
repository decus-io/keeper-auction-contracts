const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    try {
        const result = await auction.end([
            '0x9c6a9e68bcac01afb53feffbf819c1b30c56bc62',
            '0x8984a423ce4bc23e97c1795ea11a56abecb1ee56',
            '0x347ba66e4d8bb18601ba03e2b32ceb22c8a8cbd8',
            '0xf09b8dda559292111af945e91717da39eef34ade',
            '0x8def74f25f5429831044c64c057121e3322133f0',
        ]);
        console.log(`Auction ${process.env.AUCTION_ADDRESS} ended at tx: ${result.hash}`);
    } catch (e) {
        console.log(e.stack);
    }
}

main();