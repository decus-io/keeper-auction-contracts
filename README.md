keeper auction contracts
========================

## Develop

```
npm install
npx hardhat test
```

## Deploy

```
export INFURA_PROJECT_ID=
export PRIVATE_KEY=
export ETHERSCAN_API_KEY=
export AUCTION_ADDRESS=
export KEEPER_IMPORT_ADDRESS=
export LOCK_DEADLINE=
npx hardhat compile --force
npx hardhat run scripts/deploy.js --network kovan

// TODO 
npx hardhat verify --network kovan 0xBf5413513343578E28A1241E78acB0458EBD1454

npx hardhat run scripts/upgrade.js --network kovan

// flatten contract
npx hardhat flatten contracts/test/KeeperImportHarness.sol

// lock end
npx hardhat run scripts/lock_end.js --network kovan
```
