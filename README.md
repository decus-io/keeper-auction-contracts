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
npx hardhat compile --force
npx hardhat run scripts/deploy.js --network kovan

// TODO 
npx hardhat verify --network kovan 0xBf5413513343578E28A1241E78acB0458EBD1454
```
