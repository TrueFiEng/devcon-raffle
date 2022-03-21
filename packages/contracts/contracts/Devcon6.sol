// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Config.sol";
import "./models/BidModel.sol";
import "./models/StateModel.sol";

contract Devcon6 is Ownable, Config, BidModel, StateModel {
    // TODO document that using such mask introduces assumption on max number of participants (no more than 2^32)
    uint256 constant _randomMask = 0xffffffff; // 4 bytes (32 bits) to construct new random numbers

    uint256[] _raffleParticipants;
    SettleState _settleState = SettleState.AWAITING_SETTLING;

    uint256[] _auctionWinners;
    bool _proceedsClaimed;

    mapping(address => Bid) _bids;
    // bidderID -> address
    mapping(uint256 => address payable) _bidders;
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

    event NewBid(address bidder, uint256 bidderID, uint256 bidAmount);
    event NewAuctionWinner(uint256 bidderID);
    event NewRaffleWinner(uint256 bidderID);
    event NewGoldenTicketWinner(uint256 bidderID);

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
        }
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    // auctionWinners should be sorted in descending order
    function settleAuction(uint256[] calldata auctionWinners)
        external
        onlyOwner
        onlyInState(State.BIDDING_CLOSED)
    {
        _settleState = SettleState.AUCTION_SETTLED;
        uint256 biddersCount = getBiddersCount();
        if (biddersCount <= _raffleWinnersCount) {
            require(
                auctionWinners.length == 0,
                "Devcon6: invalid auction winners length"
            );
            return;
        }

        uint256 auctionParticipantsCount = biddersCount - _raffleWinnersCount;
        uint256 expectedWinnersLength = _auctionWinnersCount;
        if (auctionParticipantsCount < expectedWinnersLength) {
            expectedWinnersLength = auctionParticipantsCount;
        }

        require(
            auctionWinners.length == expectedWinnersLength,
            "Devcon6: invalid auction winners length"
        );

        _auctionWinners = auctionWinners;

        uint256 lastBidderID = type(uint256).max;
        for (uint256 i = 0; i < auctionWinners.length; ++i) {
            uint256 bidderID = auctionWinners[i];
            require(
                bidderID < lastBidderID,
                "Devcon6: bidder IDs in auction winners array must be unique and sorted in descending order"
            );
            lastBidderID = bidderID;

            setBidWinType(bidderID, WinType.AUCTION);
            emit NewAuctionWinner(bidderID);

            removeRaffleParticipant(bidderID - 1);
        }
    }

    function settleRaffle(uint256[] memory randomNumbers)
        external
        onlyOwner
        onlyInState(State.AUCTION_SETTLED)
    {
        require(
            randomNumbers.length > 0,
            "Devcon6: there must be at least one random number passed"
        );

        _settleState = SettleState.RAFFLE_SETTLED;

        uint256 participantsLength = _raffleParticipants.length;
        if (participantsLength == 0) {
            return;
        }

        (participantsLength, randomNumbers[0]) = selectGoldenTicketWinner(
            participantsLength,
            randomNumbers[0]
        );

        uint256 raffleWinnersCount = _raffleWinnersCount;
        if (participantsLength < raffleWinnersCount) {
            selectAllRaffleParticipantsAsWinners(participantsLength);
            return;
        }

        require(
            randomNumbers.length == raffleWinnersCount / 8,
            "Devcon6: passed incorrect number of random numbers"
        );

        selectRaffleWinners(participantsLength, randomNumbers);
    }

    function setBidWinType(uint256 bidderID, WinType winType) private {
        address bidderAddress = getBidderAddress(bidderID);
        _bids[bidderAddress].winType = winType;
    }

    function selectGoldenTicketWinner(
        uint256 participantsLength,
        uint256 randomNumber
    ) private returns (uint256, uint256) {
        uint256 winnerIndex = winnerIndexFromRandomNumber(
            participantsLength,
            randomNumber
        );

        uint256 bidderID = _raffleParticipants[winnerIndex];
        setBidWinType(bidderID, WinType.GOLDEN_TICKET);
        emit NewGoldenTicketWinner(bidderID);

        removeRaffleParticipant(winnerIndex);
        return (participantsLength - 1, randomNumber >> 32);
    }

    function selectAllRaffleParticipantsAsWinners(uint256 participantsLength)
        private
    {
        for (uint256 i = 0; i < participantsLength; ++i) {
            uint256 bidderID = _raffleParticipants[i];
            setBidWinType(bidderID, WinType.RAFFLE);
            emit NewRaffleWinner(bidderID);
        }
    }

    function selectRaffleWinners(
        uint256 participantsLength,
        uint256[] memory randomNumbers
    ) private {
        participantsLength = selectRandomRaffleWinners(
            participantsLength,
            randomNumbers[0],
            7
        );
        for (uint256 i = 1; i < randomNumbers.length; ++i) {
            participantsLength = selectRandomRaffleWinners(
                participantsLength,
                randomNumbers[i],
                8
            );
        }
    }

    function selectRandomRaffleWinners(
        uint256 participantsLength,
        uint256 randomNumber,
        uint256 winnersCount
    ) private returns (uint256) {
        for (uint256 i = 0; i < winnersCount; ++i) {
            uint256 winnerIndex = winnerIndexFromRandomNumber(
                participantsLength,
                randomNumber
            );

            uint256 bidderID = _raffleParticipants[winnerIndex];
            setBidWinType(bidderID, WinType.RAFFLE);
            emit NewRaffleWinner(bidderID);

            removeRaffleParticipant(winnerIndex);
            --participantsLength;
            randomNumber = randomNumber >> 32;
        }

        return participantsLength;
    }

    function winnerIndexFromRandomNumber(
        uint256 participantsLength,
        uint256 randomNumber
    ) private pure returns (uint256) {
        uint256 smallRandom = randomNumber & _randomMask;
        return smallRandom % participantsLength;
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
        onlyInState(State.RAFFLE_SETTLED)
    {
        address payable bidderAddress = getBidderAddress(bidderID);
        Bid storage bidder = _bids[bidderAddress];
        require(!bidder.claimed, "Devcon6: funds have already been claimed");
        require(
            bidder.winType != WinType.AUCTION,
            "Devcon6: auction winners cannot claim funds"
        );

        bidder.claimed = true;
        uint256 claimAmount;
        if (bidder.winType == WinType.RAFFLE) {
            claimAmount = bidder.amount - _reservePrice;
        } else {
            claimAmount = bidder.amount;
        }

        if (claimAmount > 0) {
            bidderAddress.transfer(claimAmount);
        }
    }

    function claimProceeds()
        external
        onlyOwner
        onlyInState(State.RAFFLE_SETTLED)
    {
        require(
            !_proceedsClaimed,
            "Devcon6: proceeds have already been claimed"
        );
        _proceedsClaimed = true;

        uint256 biddersCount = getBiddersCount();
        if (biddersCount == 0) {
            return;
        }

        uint256 totalAmount = 0;

        uint256 auctionWinnersCount = _auctionWinners.length;
        for (uint256 i = 0; i < auctionWinnersCount; ++i) {
            address bidderAddress = _bidders[_auctionWinners[i]];
            totalAmount += _bids[bidderAddress].amount;
        }

        uint256 raffleWinnersCount = _raffleWinnersCount - 1;
        if (biddersCount <= raffleWinnersCount) {
            raffleWinnersCount = biddersCount - 1;
        }
        totalAmount += raffleWinnersCount * _reservePrice;

        payable(owner()).transfer(totalAmount);
    }

    function withdrawUnclaimedFunds()
        external
        onlyOwner
        onlyInState(State.CLAIMING_CLOSED)
    {
        uint256 unclaimedFunds = address(this).balance;
        payable(owner()).transfer(unclaimedFunds);
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
        Bid storage bid_ = _bids[bidder];
        require(bid_.bidderID != 0, "Devcon6: no bid by given address");
        return bid_;
    }

    function getBidderAddress(uint256 bidderID)
        public
        view
        returns (address payable)
    {
        address payable bidderAddress = _bidders[bidderID];
        require(
            bidderAddress != address(0),
            "Devcon6: bidder with given ID does not exist"
        );
        return bidderAddress;
    }

    function getBiddersCount() public view returns (uint256) {
        return _nextBidderID - 1;
    }

    function getRaffleParticipants() external view returns (uint256[] memory) {
        return _raffleParticipants;
    }
}
