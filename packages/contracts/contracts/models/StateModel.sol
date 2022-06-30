// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

/***
 * @dev Defines state enums used by AuctionRaffle contract.
 * @author TrueFi Engineering team
 */
abstract contract StateModel {
    enum State {
        AWAITING_BIDDING,
        BIDDING_OPEN,
        BIDDING_CLOSED,
        AUCTION_SETTLED,
        RAFFLE_SETTLED,
        CLAIMING_CLOSED
    }

    enum SettleState {
        AWAITING_SETTLING,
        AUCTION_SETTLED,
        RAFFLE_SETTLED
    }
}
