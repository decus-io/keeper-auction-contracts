require("@nomiclabs/hardhat-truffle5");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await web3.eth.getAccounts();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.6.12",
    networks: {
        hardhat: {
            accounts: {
                count: 200,
            }
        },
        kovan: {
            url: `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
            accounts: [`0x${process.env.PRIVATE_KEY}`]
        }
    },
    mocha: {
        timeout: 2000000
    }
};

