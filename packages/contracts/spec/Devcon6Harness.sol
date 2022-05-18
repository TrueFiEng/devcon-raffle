// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "../contracts/Devcon6.sol";

contract Devcon6Harness is Devcon6 {
    constructor(
        address initialOwner,
        uint256 biddingStartTime,
        uint256 biddingEndTime,
        uint256 claimingEndTime,
        uint256 auctionWinnersCount,
        uint256 raffleWinnersCount,
        uint256 reservePrice,
        uint256 minBidIncrement
    )
    Devcon6(
        initialOwner,
        biddingStartTime,
        biddingEndTime,
        claimingEndTime,
        auctionWinnersCount,
        raffleWinnersCount,
        reservePrice,
        minBidIncrement
    )
    {}

    function getNextBidderID() public view returns (uint256) {
        return _nextBidderID;
    }

    function getBidderID(address bidderAddress) public view returns (uint256) {
        Bid storage bid_ = _bids[bidderAddress];
        require(bid_.bidderID != 0, "Devcon6: no bid by given address");
        return bid_.bidderID;
    }
}
