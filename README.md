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
npx hardhat verify --network kovan 0xc35Fb57557661eCf8E7005f929D17513588C4eB5
```