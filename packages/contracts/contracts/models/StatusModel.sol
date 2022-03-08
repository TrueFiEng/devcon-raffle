// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

abstract contract StatusModel {
    enum Status {
        PENDING,
        BIDDING_OPEN,
        BIDDING_CLOSED,
        AUCTION_SETTLED,
        RAFFLE_SETTLED,
        CLAIMING_CLOSED
    }
}