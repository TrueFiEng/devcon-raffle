pragma solidity ^0.8.0;

abstract contract BidModel {
    struct Bid {
        uint256 amount;
        uint256 bidderID;
    }
}
