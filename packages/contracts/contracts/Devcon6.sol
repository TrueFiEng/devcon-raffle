// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Config.sol";
import "./models/BidModel.sol";

contract Devcon6 is Ownable, Config, BidModel {
    mapping(address => Bid) _bids;
    // bidderID -> address
    mapping(uint256 => address) _bidders;
    uint256 _nextBidderID = 0;

    // TODO add claiming closed end time
    constructor(
        address initialOwner,
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
        Ownable()
    {
        if (initialOwner != msg.sender) {
            Ownable.transferOwnership(initialOwner);
        }
    }

    event NewBid(address bidder, uint256 bidID, uint256 bidAmount);

    function bid() external payable {
        require(
            block.timestamp >= _startTime,
            "Devcon6: bidding is not open yet"
        );
        require(
            block.timestamp < _endTime,
            "Devcon6: bidding is already closed"
        );

        Bid storage bidder = _bids[msg.sender];
        if (bidder.amount > 0) {
            require(
                msg.value >= _minBidIncrement,
                "Devcon6: bid increment too low"
            );
            bidder.amount += msg.value;
        } else {
            require(
                msg.value >= _reservePrice,
                "Devcon6: bidding amount is below reserve price"
            );
            bidder.amount = msg.value;
            bidder.bidderID = _nextBidderID++;
            _bidders[bidder.bidderID] = msg.sender;
        }
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    function settleAuction(uint256[] memory actionWinners) onlyOwner external {

    }

    function getBid(address bidder) external view returns (Bid memory) {
        return _bids[bidder];
    }

    function getBidderAddress(uint256 bidderID_)
        external
        view
        returns (address)
    {
        return _bidders[bidderID_];
    }

    function nextBidderID() external view returns (uint256) {
        return _nextBidderID;
    }
}
