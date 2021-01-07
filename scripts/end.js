const { ethers } = require("hardhat");

async function main() {
    const KeeperAuction = await ethers.getContractFactory("KeeperAuction");

    const auction = KeeperAuction.attach(process.env.AUCTION_ADDRESS);
    
    try {
        const result = await auction.end([
            '0xdb3443cd328d1774caeb94643419306c7b4a4775',
            '0xfc8a9d672dd5910c30d567db437dd6fa1fa86d9a',
            '0x8984a423ce4bc23e97c1795ea11a56abecb1ee56',
            '0xf09b8dda559292111af945e91717da39eef34ade',
            '0xce38eb60670e1c2b96b8f9413187d4e79ef7a79a',
            '0xf4ddd38a2d2f4231e1ddf131a8f3fd80804e08fe'
        ]);
        console.log(`Auction ${process.env.AUCTION_ADDRESS} ended at tx: ${result.hash}`);
    } catch (e) {
        console.log(e);
    }
}

main();