// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "./Config.sol";

contract Devcon6 is Config {
    constructor(
        uint256 startTime,
        uint256 endTime,
        uint256 auctionWinnersCount,
        uint256 raffleWinnersCount,
        uint256 reservePrice,
        uint256 minBidIncrement
    )
        Config(
            startTime,
            endTime,
            auctionWinnersCount,
            raffleWinnersCount,
            reservePrice,
            minBidIncrement
        )
    {}

    function bid() public {
        require(block.timestamp >= _startTime, "Devcon6: bidding is not open yet");
    }
}
