# Anon Aadhaar Boilerplate

This is an example app showing how to integrate the [Anon Aadhaar](https://github.com/anon-aadhaar/anon-aadhaar).

You can check the documentation [here](https://anon-aadhaar-documentation.vercel.app/)

You can fork/clone it.

To run it locally you'll need to add some env variables. You can copy the `.env.local.example` to a `.env.local` file.

```bash
NEXT_PUBLIC_ANON_AADHAAR__SEPOLIA_CONTRACT_ADDRESS=0a490C2C99a3002E5cf91caeB8049aE55f8F4EdD
NEXT_PUBLIC_CONTRACT_ADDRESS=484CcD0d7f2Ef67c03fF88A9dc6eD8038c8AD564
# WalletConnect API key
NEXT_PUBLIC_PROJECT_ID=
# Infura API key
NEXT_PUBLIC_SEPOLIA_PROVIDER_ID=
# Your wallet private key, used only in deployin contracts
PRIVATE_KEY=
```

### Install

```bash
yarn install
```

### Start

```bash
yarn dev
```

### Test

```bash
cd contracts
npx hardhat test
```
