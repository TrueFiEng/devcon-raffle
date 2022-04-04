# Devcon 6 Ticket Sale System

## Running Hardhat node
To run the Hardhat node change directory to `contracts` and then execute:
```shell
yarn node:run
```
It runs Hardhat node, deploy contracts and place bid for the first twenty accounts.

## Interacting with contracts
To interact with contracts change directory to `contracts`, then use below commands:
- `yarn node:increase-time --value 100` - increases block time by *value* seconds
- `yarn node:accounts` - prints list of available accounts
- `yarn devcon:bid --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --amount 0.6` - bids as *address* with *amount* ETH
- `yarn devcon:settle-auction` - settles auction
- `yarn devcon:settle-raffle` - settles raffle

For additional information run below command:
```shell
hardhat --network localhost
```
