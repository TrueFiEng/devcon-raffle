// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "./Config.sol";

contract Devcon6 is Config {
    mapping(address => Bid) _bidders;

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

    function bid() public payable {
        require(
            block.timestamp >= _startTime,
            "Devcon6: bidding is not open yet"
        );
        require(
            block.timestamp < _endTime,
            "Devcon6: bidding is already closed"
        );

        Bid storage bidder = _bidders[msg.sender];
        if (bidder.amount > 0) {
            return;
        }
        require(
            msg.value >= _reservePrice,
            "Devcon6: bidding amount is below reserve price"
        );
        _bidders[msg.sender] = Bid(msg.value);
    }

    function getBid(address bidder) public view returns (Bid memory) {
        return _bidders[bidder];
    }

    struct Bid {
        uint256 amount;
    }
}
