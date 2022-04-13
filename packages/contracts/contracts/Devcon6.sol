// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./Config.sol";
import "./models/BidModel.sol";
import "./models/StateModel.sol";
import "./libs/MaxHeap.sol";

contract Devcon6 is Ownable, Config, BidModel, StateModel {
    using SafeERC20 for IERC20;
    using MaxHeap for uint256[];

    mapping(address => Bid) _bids; // bidder address -> Bid
    mapping(uint256 => address payable) _bidders; // bidderID -> bidder address
    uint256 _nextBidderID = 1;

    uint256[] _heap;
    uint256 _minKeyIndex;
    uint256 _minKeyValue = type(uint256).max;

    SettleState _settleState = SettleState.AWAITING_SETTLING;
    uint256[] _raffleParticipants;

    uint256[] _auctionWinners;
    uint256[] _raffleWinners;

    bool _proceedsClaimed;
    uint256 _claimedFeesIndex;

    uint256[] _tempWinners; // temp array for sorting auction winners used by settleAuction method

    event NewBid(address bidder, uint256 bidderID, uint256 bidAmount);
    event NewAuctionWinner(uint256 bidderID);
    event NewRaffleWinner(uint256 bidderID);
    event NewGoldenTicketWinner(uint256 bidderID);

    modifier onlyInState(State requiredState) {
        require(getState() == requiredState, "Devcon6: is in invalid state");
        _;
    }

    modifier onlyExternalTransactions() {
        require(msg.sender == tx.origin, "Devcon6: internal transactions are forbidden");
        _;
    }

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

    receive() external payable {
        revert("Devcon6: contract accepts ether transfers only by bid method");
    }

    fallback() external payable {
        revert("Devcon6: contract accepts ether transfers only by bid method");
    }

    function bid() external payable onlyExternalTransactions onlyInState(State.BIDDING_OPEN) {
        Bid storage bidder = _bids[msg.sender];
        if (bidder.amount == 0) {
            require(msg.value >= _reservePrice, "Devcon6: bid amount is below reserve price");
            bidder.amount = msg.value;
            bidder.bidderID = _nextBidderID++;
            _bidders[bidder.bidderID] = payable(msg.sender);
            _raffleParticipants.push(bidder.bidderID);

            addBidToHeap(bidder.bidderID, bidder.amount);
        } else {
            require(msg.value >= _minBidIncrement, "Devcon6: bid increment too low");
            uint256 oldAmount = bidder.amount;
            bidder.amount += msg.value;

            updateHeapBid(bidder.bidderID, oldAmount, bidder.amount);
        }
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    function settleAuction() external onlyOwner onlyInState(State.BIDDING_CLOSED) {
        _settleState = SettleState.AUCTION_SETTLED;
        uint256 biddersCount = getBiddersCount();
        uint256 raffleWinnersCount = _raffleWinnersCount;
        if (biddersCount <= raffleWinnersCount) {
            return;
        }

        uint256 auctionParticipantsCount = biddersCount - raffleWinnersCount;
        uint256 winnersLength = _auctionWinnersCount;
        if (auctionParticipantsCount < winnersLength) {
            winnersLength = auctionParticipantsCount;
        }

        for (uint256 i = 0; i < winnersLength; ++i) {
            uint256 key = _heap.removeMax();
            uint256 bidderID = extractBidderID(key);
            addAuctionWinner(bidderID);
            _tempWinners.insert(bidderID);
        }

        delete _heap;
        delete _minKeyIndex;
        delete _minKeyValue;

        for (uint256 i = 0; i < winnersLength; ++i) {
            uint256 bidderID = _tempWinners.removeMax();
            removeRaffleParticipant(bidderID - 1);
        }
    }

    function settleRaffle(uint256[] memory randomNumbers) external onlyOwner onlyInState(State.AUCTION_SETTLED) {
        require(randomNumbers.length > 0, "Devcon6: there must be at least one random number passed");

        _settleState = SettleState.RAFFLE_SETTLED;

        uint256 participantsLength = _raffleParticipants.length;
        if (participantsLength == 0) {
            return;
        }

        (participantsLength, randomNumbers[0]) = selectGoldenTicketWinner(participantsLength, randomNumbers[0]);

        uint256 raffleWinnersCount = _raffleWinnersCount;
        if (participantsLength < raffleWinnersCount) {
            selectAllRaffleParticipantsAsWinners(participantsLength);
            return;
        }

        require(
            randomNumbers.length == raffleWinnersCount / _winnersPerRandom,
            "Devcon6: passed incorrect number of random numbers"
        );

        selectRaffleWinners(participantsLength, randomNumbers);
    }

    function claim(uint256 bidderID) external onlyInState(State.RAFFLE_SETTLED) {
        address payable bidderAddress = getBidderAddress(bidderID);
        Bid storage bidder = _bids[bidderAddress];
        require(!bidder.claimed, "Devcon6: funds have already been claimed");
        require(bidder.winType != WinType.AUCTION, "Devcon6: auction winners cannot claim funds");

        bidder.claimed = true;
        uint256 claimAmount;
        if (bidder.winType == WinType.RAFFLE) {
            claimAmount = bidder.amount - _reservePrice;
        } else if (bidder.winType == WinType.GOLDEN_TICKET) {
            claimAmount = bidder.amount;
        } else if (bidder.winType == WinType.LOSS) {
            claimAmount = (bidder.amount * 98) / 100;
        }

        if (claimAmount > 0) {
            bidderAddress.transfer(claimAmount);
        }
    }

    function claimProceeds() external onlyOwner onlyInState(State.RAFFLE_SETTLED) {
        require(!_proceedsClaimed, "Devcon6: proceeds have already been claimed");
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

    function claimFees(uint256 bidsCount) external onlyOwner onlyInState(State.RAFFLE_SETTLED) {
        uint256 claimedFeesIndex = _claimedFeesIndex;
        uint256 feesCount = _raffleParticipants.length;
        require(feesCount > 0, "Devcon6: there are no fees to claim");
        require(claimedFeesIndex < feesCount, "Devcon6: fees have already been claimed");

        uint256 endIndex = claimedFeesIndex + bidsCount;
        if (endIndex > feesCount) {
            endIndex = feesCount;
        }

        uint256 fee = 0;
        for (uint256 i = claimedFeesIndex; i < endIndex; ++i) {
            address bidderAddress = getBidderAddress(_raffleParticipants[i]);
            uint256 bidAmount = _bids[bidderAddress].amount;
            fee += bidAmount - (bidAmount * 98) / 100;
        }

        _claimedFeesIndex = endIndex;
        payable(owner()).transfer(fee);
    }

    function withdrawUnclaimedFunds() external onlyOwner onlyInState(State.CLAIMING_CLOSED) {
        uint256 unclaimedFunds = address(this).balance;
        payable(owner()).transfer(unclaimedFunds);
    }

    function rescueTokens(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));

        require(balance > 0, "Devcon6: no tokens for given address");
        token.safeTransfer(owner(), balance);
    }

    function getRaffleParticipants() external view returns (uint256[] memory) {
        return _raffleParticipants;
    }

    function getAuctionWinners() external view returns (uint256[] memory) {
        return _auctionWinners;
    }

    function getRaffleWinners() external view returns (uint256[] memory) {
        return _raffleWinners;
    }

    function getBid(address bidder) external view returns (Bid memory) {
        Bid storage bid_ = _bids[bidder];
        require(bid_.bidderID != 0, "Devcon6: no bid by given address");
        return bid_;
    }

    function getBidByID(uint256 bidderID) external view returns (Bid memory) {
        address bidder = getBidderAddress(bidderID);
        return _bids[bidder];
    }

    function getBidWithAddress(uint256 bidderID) public view returns (BidWithAddress memory) {
        address bidder = getBidderAddress(bidderID);
        Bid storage bid_ = _bids[bidder];

        BidWithAddress memory bidWithAddress = BidWithAddress({bidder: bidder, bid: bid_});

        return bidWithAddress;
    }

    function getBidsWithAddresses() external view returns (BidWithAddress[] memory) {
        uint256 totalBids = _nextBidderID - 1;

        BidWithAddress[] memory bids = new BidWithAddress[](totalBids);

        for (uint256 i = 1; i <= totalBids; ++i) {
            BidWithAddress memory bid_ = getBidWithAddress(i);
            bids[i - 1] = bid_;
        }

        return bids;
    }

    function getBidderAddress(uint256 bidderID) public view returns (address payable) {
        address payable bidderAddress = _bidders[bidderID];
        require(bidderAddress != address(0), "Devcon6: bidder with given ID does not exist");
        return bidderAddress;
    }

    function getBiddersCount() public view returns (uint256) {
        return _nextBidderID - 1;
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

    function addBidToHeap(uint256 bidderID, uint256 amount) private {
        bool isHeapFull = getBiddersCount() > _auctionWinnersCount; // bid() already incremented _nextBidderID
        uint256 key = getKey(bidderID, amount);
        uint256 minKeyValue = _minKeyValue;

        if (isHeapFull) {
            if (key <= minKeyValue) {
                return;
            }
            _heap.increaseKey(minKeyValue, key);
            updateMinKey();
        } else {
            _heap.insert(key);
            if (key <= minKeyValue) {
                _minKeyIndex = _heap.length - 1;
                _minKeyValue = key;
                return;
            }
            updateMinKey();
        }
    }

    function updateHeapBid(
        uint256 bidderID,
        uint256 oldAmount,
        uint256 newAmount
    ) private {
        bool isHeapFull = getBiddersCount() >= _auctionWinnersCount;
        uint256 key = getKey(bidderID, newAmount);
        uint256 minKeyValue = _minKeyValue;

        bool shouldUpdateHeap = key > minKeyValue;
        if (isHeapFull && !shouldUpdateHeap) {
            return;
        }
        uint256 oldKey = getKey(bidderID, oldAmount);
        bool updatingMinKey = oldKey <= minKeyValue;
        if (updatingMinKey) {
            _heap.increaseKeyAt(_minKeyIndex, key);
            updateMinKey();
            return;
        }
        _heap.increaseKey(oldKey, key);
    }

    function updateMinKey() private {
        (_minKeyIndex, _minKeyValue) = _heap.findMin();
    }

    function addAuctionWinner(uint256 bidderID) private {
        setBidWinType(bidderID, WinType.AUCTION);
        _auctionWinners.push(bidderID);
        emit NewAuctionWinner(bidderID);
    }

    function addRaffleWinner(uint256 bidderID) private {
        setBidWinType(bidderID, WinType.RAFFLE);
        _raffleWinners.push(bidderID);
        emit NewRaffleWinner(bidderID);
    }

    function addGoldenTicketWinner(uint256 bidderID) private {
        setBidWinType(bidderID, WinType.GOLDEN_TICKET);
        _raffleWinners.push(bidderID);
        emit NewGoldenTicketWinner(bidderID);
    }

    function setBidWinType(uint256 bidderID, WinType winType) private {
        address bidderAddress = getBidderAddress(bidderID);
        _bids[bidderAddress].winType = winType;
    }

    function selectGoldenTicketWinner(uint256 participantsLength, uint256 randomNumber)
        private
        returns (uint256, uint256)
    {
        uint256 winnerIndex = winnerIndexFromRandomNumber(participantsLength, randomNumber);

        uint256 bidderID = _raffleParticipants[winnerIndex];
        addGoldenTicketWinner(bidderID);

        removeRaffleParticipant(winnerIndex);
        return (participantsLength - 1, randomNumber >> _randomMaskLength);
    }

    function selectAllRaffleParticipantsAsWinners(uint256 participantsLength) private {
        for (uint256 i = 0; i < participantsLength; ++i) {
            uint256 bidderID = _raffleParticipants[i];
            addRaffleWinner(bidderID);
        }
        delete _raffleParticipants;
    }

    function selectRaffleWinners(uint256 participantsLength, uint256[] memory randomNumbers) private {
        participantsLength = selectRandomRaffleWinners(participantsLength, randomNumbers[0], _winnersPerRandom - 1);
        for (uint256 i = 1; i < randomNumbers.length; ++i) {
            participantsLength = selectRandomRaffleWinners(participantsLength, randomNumbers[i], _winnersPerRandom);
        }
    }

    function selectRandomRaffleWinners(
        uint256 participantsLength,
        uint256 randomNumber,
        uint256 winnersCount
    ) private returns (uint256) {
        for (uint256 i = 0; i < winnersCount; ++i) {
            uint256 winnerIndex = winnerIndexFromRandomNumber(participantsLength, randomNumber);

            uint256 bidderID = _raffleParticipants[winnerIndex];
            addRaffleWinner(bidderID);

            removeRaffleParticipant(winnerIndex);
            --participantsLength;
            randomNumber = randomNumber >> _randomMaskLength;
        }

        return participantsLength;
    }

    function removeRaffleParticipant(uint256 index) private {
        uint256 participantsLength = _raffleParticipants.length;
        require(index < participantsLength, "Devcon6: invalid raffle participant index");
        _raffleParticipants[index] = _raffleParticipants[participantsLength - 1];
        _raffleParticipants.pop();
    }

    function getKey(uint256 bidderID, uint256 amount) private pure returns (uint256) {
        return (amount << _bidderMaskLength) | (_bidderMask - bidderID);
    }

    function extractBidderID(uint256 key) private pure returns (uint256) {
        return _bidderMask - (key & _bidderMask);
    }

    function winnerIndexFromRandomNumber(uint256 participantsLength, uint256 randomNumber)
        private
        pure
        returns (uint256)
    {
        uint256 smallRandom = randomNumber & _randomMask;
        return smallRandom % participantsLength;
    }
}
