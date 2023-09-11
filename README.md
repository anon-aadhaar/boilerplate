# Anon Aadhaar Example

This is an example app showing how to integrate the [Anon Aadhaar](https://github.com/privacy-scaling-explorations/anon-aadhaar).

You can check the documentation [here](https://anon-aadhaar-documentation.vercel.app/)

You can fork/clone it.

To run it locally you'll need to add some env variables.

```bash
PRIVATE_KEY=<Your deployer wallet private key>
NEXT_PUBLIC_CONTRACT_ADDRESS=<The address of the contract you've deployed without the 0x>
NEXT_PUBLIC_PROJECT_ID=<Your WalletConnect project ID>
NEXT_PUBLIC_GOERLI_PROVIDER_ID=<Your provider ID>
```

### Install

```bash
yarn install
```

### Start

```bash
yarn dev
```
