// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

abstract contract StateModel {
    enum State {
        WAITING_FOR_BIDDING,
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
