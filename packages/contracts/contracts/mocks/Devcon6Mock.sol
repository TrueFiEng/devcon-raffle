// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "../Devcon6.sol";

contract Devcon6Mock is Devcon6 {
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

    function getHeap() external view returns (uint256[] memory) {
        return _heap;
    }

    function getHeapMax() external view returns (uint256) {
        return _heap[0];
    }

    function getBidAmount(address bidder) external view returns (uint256) {
        return _bids[bidder].amount;
    }

    function getNumberOfBids() external view returns (uint256) {
        return _heap.length;
    }

    function getNumberOfRaffleParticipants() external view returns (uint256) {
        return _raffleParticipants.length;
    }

    function getNumberOfAuctionParticipants() external view returns (uint256) {
        return _raffleParticipants.length;
    }

    function getRaffleWinnersCount() external view returns (uint256) {
        return _raffleWinnersCount;
    }

    function getAuctionWinnersCount() external view returns (uint256) {
        return _auctionWinnersCount;
    }

    function getMinKeyIndex() external view returns (uint256) {
        return _minKeyIndex;
    }

    function getWinType(address bidderAddress) external view returns (WinType) {
        return _bids[bidderAddress].winType;
    }

    function getMinKeyValue() external view returns (uint256) {
        return _minKeyValue;
    }
}
