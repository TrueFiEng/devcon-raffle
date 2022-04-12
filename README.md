# Devcon 6 Ticket Sale System

## Running Hardhat node
Change directory to `packages/contracts` and execute:
```shell
yarn node:run
```
This will start a Hardhat node, deploy the contracts and place initial bids using the first twenty auto-generated accounts.

## Custom tasks
A number of custom Hardhat tasks were defined to aid testing.

### Managing local node
- `yarn node:increase-time --value <INT>` - increase block time by *value* seconds
- `yarn node:accounts` - print a list of available accounts

### Interacting with Devcon6 contract

#### Hardhat
- `yarn hardhat:bid --account <STRING> --amount <STRING>` - using *account* place bid of *amount* ETH
- `yarn hardhat:settle-auction` - settle auction
- `yarn hardhat:settle-raffle` - settle raffle using random numbers

#### Arbitrum Rinkeby
- `yarn rinkeby:transfer-ether` - transfer ether from `DEPLOYER` to `PRIVATE_KEYS` accounts
- `yarn rinkeby:deploy [--delay <INT>]` - deploy Devcon6 contract, *delay* in seconds can be set to push back bidding start time
- `yarn rinkeby:init-bids` - place initial bids using `PRIVATE_KEYS` accounts
