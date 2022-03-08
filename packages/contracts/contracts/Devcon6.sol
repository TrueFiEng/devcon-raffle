// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Config.sol";
import "./models/BidModel.sol";
import "./models/StateModel.sol";

contract Devcon6 is Ownable, Config, BidModel, StateModel {
    uint256[] _auctionWinners;
    uint256[] _raffleWinners;
    uint256[] _raffleParticipants;
    bool _notEnoughParticipantsForAuction;

    mapping(address => Bid) _bids;
    // bidderID -> address
    mapping(uint256 => address) _bidders;
    uint256 _nextBidderID = 1;

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
        Config(
            biddingStartTime,
            biddingEndTime,
            claimingEndTime,
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

    modifier onlyInState(State requiredState) {
        require(getState() == requiredState, "Devcon6: is in invalid state");

        _;
    }

    event NewBid(address bidder, uint256 bidID, uint256 bidAmount);

    function bid() external payable onlyInState(State.BIDDING_OPEN) {
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
            _raffleParticipants.push(bidder.bidderID);
        }
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    // auctionWinners should be sorted in descending order
    function settleAuction(uint256[] memory auctionWinners)
        external
        onlyOwner
        onlyInState(State.BIDDING_CLOSED)
    {
        if (getBiddersCount() <= _raffleWinnersCount) {
            _notEnoughParticipantsForAuction = true;
            return;
        }

        uint256 expectedWinnersLength = _auctionWinnersCount;
        uint256 auctionParticipantsCount = getBiddersCount() -
            _raffleWinnersCount;
        if (auctionParticipantsCount < _auctionWinnersCount) {
            expectedWinnersLength = auctionParticipantsCount;
        }

        require(
            auctionWinners.length == expectedWinnersLength,
            "Devcon6: invalid auction winners length"
        );

        for (uint256 i = 0; i < auctionWinners.length; i++) {
            uint256 winner = auctionWinners[i];
            require(
                _bidders[winner] != address(0),
                "Devcon6: given winner does not exist"
            );
            _auctionWinners.push(winner);
            removeRaffleParticipant(winner - 1);
        }
    }

    function removeRaffleParticipant(uint256 index) private {
        uint256 participantsLength = _raffleParticipants.length;
        require(
            index < participantsLength,
            "Devcon6: invalid raffle participant index"
        );
        _raffleParticipants[index] = _raffleParticipants[
            participantsLength - 1
        ];
        _raffleParticipants.pop();
    }

    function getState() public view returns (State) {
        if (block.timestamp >= _claimingEndTime) {
            return State.CLAIMING_CLOSED;
        }
        if (_raffleWinners.length > 0) {
            return State.RAFFLE_SETTLED;
        }
        if (_auctionWinners.length > 0 || _notEnoughParticipantsForAuction) {
            return State.AUCTION_SETTLED;
        }
        if (block.timestamp >= _biddingEndTime) {
            return State.BIDDING_CLOSED;
        }
        if (block.timestamp >= _biddingStartTime) {
            return State.BIDDING_OPEN;
        }
        return State.WAITING_FOR_BIDDING;
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

    function getBiddersCount() public view returns (uint256) {
        return _nextBidderID - 1;
    }

    function getAuctionWinners() external view returns (uint256[] memory) {
        return _auctionWinners;
    }

    function getRaffleParticipants() external view returns (uint256[] memory) {
        return _raffleParticipants;
    }
}
