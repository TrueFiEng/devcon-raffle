// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

contract Config {
    uint256 public immutable _biddingStartTime;
    uint256 public immutable _biddingEndTime;
    uint256 public immutable _claimingEndTime;
    uint256 public immutable _auctionWinnersCount;
    uint256 public immutable _raffleWinnersCount;
    uint256 public immutable _reservePrice;
    uint256 public immutable _minBidIncrement;

    // TODO check if it makes sense to use smaller types to save on calldata cost
    // TODO think about edge cases with auctionWinnersCount_, raffleWinnersCount_
    constructor(
        uint256 biddingStartTime_,
        uint256 biddingEndTime_,
        uint256 claimingEndTime_,
        uint256 auctionWinnersCount_,
        uint256 raffleWinnersCount_,
        uint256 reservePrice_,
        uint256 minBidIncrement_
    ) {
        require(auctionWinnersCount_ > 0, "Config: auction winners count must be greater than 0");
        require(raffleWinnersCount_ > 0, "Config: raffle winners count must be greater than 0");
        require(
            raffleWinnersCount_ % 8 == 0,
            "Config: raffle winners count must be divisible by 8"
        );

        _biddingStartTime = biddingStartTime_;
        _biddingEndTime = biddingEndTime_;
        _claimingEndTime = claimingEndTime_;
        _auctionWinnersCount = auctionWinnersCount_;
        _raffleWinnersCount = raffleWinnersCount_;
        _reservePrice = reservePrice_;
        _minBidIncrement = minBidIncrement_;
    }

    function biddingStartTime() external view returns (uint256) {
        return _biddingStartTime;
    }

    function biddingEndTime() external view returns (uint256) {
        return _biddingEndTime;
    }

    function claimingEndTime() external view returns (uint256) {
        return _claimingEndTime;
    }

    function auctionWinnersCount() external view returns (uint256) {
        return _auctionWinnersCount;
    }

    function raffleWinnersCount() external view returns (uint256) {
        return _raffleWinnersCount;
    }

    function reservePrice() external view returns (uint256) {
        return _reservePrice;
    }

    function minBidIncrement() external view returns (uint256) {
        return _minBidIncrement;
    }
}
