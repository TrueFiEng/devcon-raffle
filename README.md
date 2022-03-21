# Devcon 6 Ticket Sale System

## Running Hardhat node
To run the Hardhat node change directory to `contracts` and then execute:
```shell
yarn local-node
```
It runs Hardhat node, deploy contracts and place bid for the first twenty accounts.

## Interacting with contracts
To interact with contracts change directory to `contracts` and then use for list and description of available commands:
```shell
hardhat --network localhost
```

Command example:
```shell
hardhat --network localhost bid --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --amount 0.6
```


