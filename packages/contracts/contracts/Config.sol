// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

contract Config {
    uint256 public _startTime;
    uint256 public _endTime;
    uint256 public _auctionWinnersCount;
    uint256 public _raffleWinnersCount;
    uint256 public _reservePrice;
    uint256 public _minBidIncrement;

    // TODO check if it makes sense to use smaller types to save on calldata cost
    constructor(
        uint256 startTime_,
        uint256 endTime_,
        uint256 auctionWinnersCount_,
        uint256 raffleWinnersCount_,
        uint256 reservePrice_,
        uint256 minBidIncrement_
    ) {
        _startTime = startTime_;
        _endTime = endTime_;
        _auctionWinnersCount = auctionWinnersCount_;
        _raffleWinnersCount = raffleWinnersCount_;
        _reservePrice = reservePrice_;
        _minBidIncrement = minBidIncrement_;
    }

    function startTime() external view returns (uint256) {
        return _startTime;
    }

    function endTime() external view returns (uint256) {
        return _endTime;
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
