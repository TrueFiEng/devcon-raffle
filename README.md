# Devcon 6 Ticket Sale System

## Running Hardhat node
To run the Hardhat node change directory to `contracts` and then execute:
```shell
yarn local-node
```
It runs Hardhat node, deploy contracts and place bid for the first twenty accounts.

## Interacting with contracts
To interact with contracts change directory to `contracts`, then use below commands:
- `yarn increase-time --value 100` - increases block time by *value* seconds
- `yarn accounts` - prints list of available accounts
- `yarn devcon:bid --address 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc --amount 0.6` - bids as *address* with *amount* ETH
- `yarn devcon:settle-auction --winners "[1,2]"` - settles auction and selects winners based on passed array of bidders IDs
- `yarn devcon:settle-raffle` - settles raffle

For additional information run below command:
```shell
hardhat --network localhost
```
