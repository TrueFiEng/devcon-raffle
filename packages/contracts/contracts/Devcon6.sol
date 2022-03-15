// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Config.sol";
import "./models/BidModel.sol";
import "./models/StateModel.sol";
import "./RedBlackTree.sol";

// TODO replace i++ with ++i everywhere

contract Devcon6 is Ownable, Config, BidModel, StateModel {
    using BokkyPooBahsRedBlackTreeLibrary for BokkyPooBahsRedBlackTreeLibrary.Tree;
    BokkyPooBahsRedBlackTreeLibrary.Tree tree;
    uint256 constant _bidderMask = 0xffff;
    uint256 _smallestTreeNode = type(uint256).max;


    uint256[] _raffleParticipants;
    SettleState _settleState = SettleState.AWAITING_SETTLING;
    uint256 _winnersCount;

    uint256[] _auctionWinners;
    bool _claimProceeded;

    mapping(address => Bid) _bids;
    // bidderID -> address
    mapping(uint256 => address payable) _bidders;
    uint256 _nextBidderID = 1;
    // TODO document that using such mask introduces assumption on max number of participants (no more than 2^32)
    uint256 constant _randomMask = 0xffffffff; // 4 bytes (32 bits) to construct new random numbers

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
            _bidders[bidder.bidderID] = payable(msg.sender);
            _raffleParticipants.push(bidder.bidderID);

            addToTree(bidder.bidderID, bidder.amount);
        }
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    function addToTree(uint256 bidderID, uint256 amount) internal {
        amount = amount << 16;
        amount = amount | (_bidderMask - bidderID);

        tree.insert(amount);
    }

    function first() public view returns (uint _key) {
        _key = tree.first();
    }

    // auctionWinners should be sorted in descending order // TODO if we don't sort on chain add a check for it
    function settleAuction(uint256[] memory auctionWinners)
        external
        onlyOwner
        onlyInState(State.BIDDING_CLOSED)
    {
        _settleState = SettleState.AUCTION_SETTLED;
        if (getBiddersCount() <= _raffleWinnersCount) {
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

        _winnersCount = expectedWinnersLength;
        _auctionWinners = auctionWinners;
        for (uint256 i = 0; i < auctionWinners.length; i++) {
            uint256 bidderID = auctionWinners[i];
            setBidWinType(bidderID, WinType.AUCTION);
            removeRaffleParticipant(bidderID - 1);
        }
    }

    // TODO see if it is cheaper to extract _raffleParticipants.length to variable
    function settleRaffle(uint256[] memory randomNumbers)
        external
        onlyOwner
        onlyInState(State.AUCTION_SETTLED)
    {
        _settleState = SettleState.RAFFLE_SETTLED;
        if (_raffleParticipants.length <= _raffleWinnersCount) {
            selectAllRaffleParticipantsAsWinners();
            return;
        }

        require(
            randomNumbers.length == _raffleWinnersCount / 8,
            "Devcon6: passed raffle winners length does not match the preset length"
        );

        for (uint256 i = 0; i < randomNumbers.length; i++) {
            selectRandomRaffleWinners(randomNumbers[i]);
        }
    }

    function selectAllRaffleParticipantsAsWinners() private {
        for (uint256 i = 0; i < _raffleParticipants.length; i++) {
            setBidWinType(_raffleParticipants[i], WinType.RAFFLE);
        }
    }

    function setBidWinType(uint256 bidID, WinType winType) private {
        address bidderAddress = _bidders[bidID];
        require(
            bidderAddress != address(0),
            "Devcon6: given winner does not exist"
        );
        _bids[bidderAddress].winType = winType;
    }

    function selectRandomRaffleWinners(uint256 randomNumber) private {
        uint256 participantsLength = _raffleParticipants.length;
        for (uint256 i = 0; i < 8; i++) {
            uint256 smallRandom = randomNumber & _randomMask;
            uint256 winnerIndex = smallRandom % participantsLength;

            if (i == 0) {
                setBidWinType(
                    _raffleParticipants[winnerIndex],
                    WinType.GOLDEN_TICKET
                );
            } else {
                setBidWinType(_raffleParticipants[winnerIndex], WinType.RAFFLE);
            }

            removeRaffleParticipant(winnerIndex);
            --participantsLength;
            randomNumber = randomNumber >> 32;
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

    function claim(uint256 bidderID)
        external
        payable
        onlyInState(State.RAFFLE_SETTLED)
    {
        address payable bidderAddress = _bidders[bidderID];
        require(
            bidderAddress != address(0),
            "Devcon6: given bidder does not exist"
        );

        Bid storage bidder = _bids[bidderAddress];
        require(!bidder.claimed, "Devcon6: funds have been already claimed");
        require(
            bidder.winType != WinType.AUCTION,
            "Devcon6: auction winners cannot claim funds"
        );

        bidder.claimed = true;
        uint256 claimAmount;
        if (bidder.winType == WinType.RAFFLE) {
            claimAmount = bidder.amount - _reservePrice;
        } else if (bidder.winType == WinType.GOLDEN_TICKET) {
            claimAmount = bidder.amount;
        } else if (bidder.winType == WinType.LOSS) {
            claimAmount = bidder.amount;
        }

        if (claimAmount > 0) {
            bidderAddress.transfer(claimAmount);
        }
    }

    function claimProceeds()
        external
        payable
        onlyOwner
        onlyInState(State.RAFFLE_SETTLED)
    {
        require(!_claimProceeded, "Devcon6: proceeds has been already claimed");
        _claimProceeded = true;

        uint256 biddersCount = getBiddersCount();
        if (biddersCount == 0) {
            return;
        }

        uint256 totalAmount = 0;
        uint256 winnersCount = _auctionWinners.length;
        for (uint256 i = 0; i < winnersCount; ++i) {
            address bidderAddress = _bidders[_auctionWinners[i]];
            totalAmount += _bids[bidderAddress].amount;
        }

        winnersCount = _raffleWinnersCount - 1;
        if (biddersCount <= winnersCount) {
            winnersCount = biddersCount - 1;
        }
        totalAmount += winnersCount * _reservePrice;

        payable(msg.sender).transfer(totalAmount);
    }

    function withdrawUnclaimedFunds()
        external
        payable
        onlyOwner
        onlyInState(State.CLAIMING_CLOSED)
    {
        uint256 unclaimedFunds = address(this).balance;
        payable(msg.sender).transfer(unclaimedFunds);
    }

    function getState() public view returns (State) {
        if (block.timestamp >= _claimingEndTime) {
            return State.CLAIMING_CLOSED;
        }
        if (_settleState == SettleState.RAFFLE_SETTLED) {
            return State.RAFFLE_SETTLED;
        }
        if (_settleState == SettleState.AUCTION_SETTLED) {
            return State.AUCTION_SETTLED;
        }
        if (block.timestamp >= _biddingEndTime) {
            return State.BIDDING_CLOSED;
        }
        if (block.timestamp >= _biddingStartTime) {
            return State.BIDDING_OPEN;
        }
        return State.AWAITING_BIDDING;
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

    function getRaffleParticipants() external view returns (uint256[] memory) {
        return _raffleParticipants;
    }
}
