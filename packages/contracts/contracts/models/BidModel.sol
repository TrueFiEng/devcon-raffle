// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

abstract contract BidModel {
    struct Bid {
        uint256 bidderID;
        uint256 amount;
        WinType winType;
        bool claimed;
    }

    struct BidWithAddress {
        address bidder;
        Bid bid;
    }

    enum WinType {
        LOSS,
        GOLDEN_TICKET,
        AUCTION,
        RAFFLE
    }
}
