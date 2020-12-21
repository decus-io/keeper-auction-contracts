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
npx hardhat compile --force
npx hardhat run scripts/deploy.js --network kovan
```