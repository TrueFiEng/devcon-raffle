pragma solidity 0.8.10;

abstract contract BidModel {
    struct Bid {
        uint256 amount;
        uint256 bidderID;
    }
}
