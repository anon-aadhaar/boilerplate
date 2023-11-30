# Anon Aadhaar Example

This is an example app showing how to integrate the [Anon Aadhaar](https://github.com/privacy-scaling-explorations/anon-aadhaar).

You can check the documentation [here](https://anon-aadhaar-documentation.vercel.app/)

You can fork/clone it.

To run it locally you'll need to add some env variables. You can copy the `.env.local.example` to a `.env.local` file.

```bash
PRIVATE_KEY="<Your deployer wallet private key>"
NEXT_PUBLIC_CONTRACT_ADDRESS="<The address of the contract you've deployed without the 0x>"
NEXT_PUBLIC_PROJECT_ID="<Your WalletConnect project ID>"
NEXT_PUBLIC_GOERLI_PROVIDER_ID="<Your provider ID>"
NEXT_PUBLIC_APP_ID="<Your application ID>"
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
