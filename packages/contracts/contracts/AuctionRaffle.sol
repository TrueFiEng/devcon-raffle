// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./Config.sol";
import "./models/BidModel.sol";
import "./models/StateModel.sol";
import "./libs/MaxHeap.sol";
import "./libs/FeistelShuffleOptimised.sol";
import "./libs/VRFRequester.sol";
import "./verifier/IVerifier.sol";

/***
 * @title Auction & Raffle
 * @notice Draws winners using a mixed auction & raffle scheme.
 * @author TrueFi Engineering team
 */
contract AuctionRaffle is Ownable, Config, BidModel, StateModel, VRFRequester {
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

    uint256 public _randomSeed;

    /// @dev A new bid has been placed or an existing bid has been bumped
    event NewBid(address bidder, uint256 bidderID, uint256 bidAmount);

    /// @dev A bidder has been drawn as auction winner
    event NewAuctionWinner(uint256 bidderID);

    /// @dev Raffle winners have been drawn
    event RaffleWinnersDrawn(uint256 randomSeed);

    modifier onlyInState(State requiredState) {
        require(getState() == requiredState, "AuctionRaffle: is in invalid state");
        _;
    }

    modifier onlyExternalTransactions() {
        require(msg.sender == tx.origin, "AuctionRaffle: internal transactions are forbidden");
        _;
    }

    constructor(
        address initialOwner,
        ConfigParams memory configParams,
        VRFRequesterParams memory vrfRequesterParams
    ) Config(configParams) VRFRequester(vrfRequesterParams) Ownable() {
        if (initialOwner != msg.sender) {
            Ownable.transferOwnership(initialOwner);
        }
    }

    receive() external payable {
        revert("AuctionRaffle: contract accepts ether transfers only by bid method");
    }

    fallback() external payable {
        revert("AuctionRaffle: contract accepts ether transfers only by bid method");
    }

    /***
     * @notice Places a new bid.
     * @dev Assigns a unique bidderID to the sender address.
     * @param score The user's sybil resistance score
     * @param proof Attestation signature of the score
     */
    function bid(
        uint256 score,
        bytes calldata proof
    ) external payable onlyExternalTransactions onlyInState(State.BIDDING_OPEN) {
        IVerifier(bidVerifier).verify(abi.encode(msg.sender, score), proof);
        Bid storage bidder = _bids[msg.sender];
        require(bidder.amount == 0, "AuctionRaffle: bid already exists");
        require(msg.value >= _reservePrice, "AuctionRaffle: bid amount is below reserve price");
        bidder.amount = msg.value;
        bidder.bidderID = _nextBidderID++;
        _bidders[bidder.bidderID] = payable(msg.sender);
        bidder.raffleParticipantIndex = uint240(_raffleParticipants.length);
        _raffleParticipants.push(bidder.bidderID);

        addBidToHeap(bidder.bidderID, bidder.amount);
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    /***
     * @notice Bumps an existing bid.
     */
    function bump() external payable onlyExternalTransactions onlyInState(State.BIDDING_OPEN) {
        Bid storage bidder = _bids[msg.sender];
        require(bidder.amount != 0, "AuctionRaffle: bump nonexistent bid");
        require(msg.value >= _minBidIncrement, "AuctionRaffle: bid increment too low");
        uint256 oldAmount = bidder.amount;
        bidder.amount += msg.value;

        updateHeapBid(bidder.bidderID, oldAmount, bidder.amount);
        emit NewBid(msg.sender, bidder.bidderID, bidder.amount);
    }

    /**
     * @notice Draws auction winners and changes contract state to AUCTION_SETTLED.
     * @dev Removes highest bids from the heap, sets their WinType to AUCTION and adds them to _auctionWinners array.
     * Temporarily adds auction winner bidderIDs to a separate heap and then retrieves them in descending order.
     * This is done to efficiently remove auction winners from _raffleParticipants array as they no longer take part
     * in the raffle.
     */
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
        }

        delete _heap;
        delete _minKeyIndex;
        delete _minKeyValue;
    }

    /**
     * @notice Initiate raffle draw by requesting a random number from Chainlink VRF.
     */
    function settleRaffle() external onlyOwner onlyInState(State.AUCTION_SETTLED) returns (uint256 requestId) {
        return _getRandomNumber();
    }

    /**
     * @notice Draws raffle winners and changes contract state to RAFFLE_SETTLED. The first selected raffle winner
     * becomes the Golden Ticket winner.
     * @param randomSeed A single 256-bit random seed.
     */
    function _receiveRandomNumber(uint256 randomSeed) internal override onlyInState(State.AUCTION_SETTLED) {
        _settleState = SettleState.RAFFLE_SETTLED;
        _randomSeed = randomSeed;

        emit RaffleWinnersDrawn(randomSeed);
    }

    /**
     * @notice Allows a bidder to claim their funds after the raffle is settled.
     * Golden Ticket winner can withdraw the full bid amount.
     * Raffle winner can withdraw the bid amount minus `_reservePrice`.
     * Non-winning bidder can withdraw the bid amount minus 2% fee.
     * Auction winner pays the full bid amount and is not entitled to any withdrawal.
     */
    function claim(uint256 bidderID) external onlyInState(State.RAFFLE_SETTLED) {
        address payable bidderAddress = getBidderAddress(bidderID);
        Bid storage bidder = _bids[bidderAddress];
        require(!bidder.claimed, "AuctionRaffle: funds have already been claimed");
        require(!bidder.isAuctionWinner, "AuctionRaffle: auction winners cannot claim funds");
        bidder.claimed = true;

        WinType winType = getBidWinType(bidderID);
        uint256 claimAmount;
        if (winType == WinType.GOLDEN_TICKET || winType == WinType.LOSS) {
            claimAmount = bidder.amount;
        } else if (winType == WinType.RAFFLE) {
            claimAmount = bidder.amount - _reservePrice;
        }

        if (claimAmount > 0) {
            bidderAddress.transfer(claimAmount);
        }
    }

    /**
     * @notice Allows the owner to claim proceeds from the ticket sale after the raffle is settled.
     * Proceeds include:
     * sum of auction winner bid amounts,
     * `_reservePrice` paid by each raffle winner (except the Golden Ticket winner).
     */
    function claimProceeds() external onlyOwner onlyInState(State.RAFFLE_SETTLED) {
        require(!_proceedsClaimed, "AuctionRaffle: proceeds have already been claimed");
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

    /**
     * @notice Allows the owner to withdraw all funds left in the contract by the participants.
     * Callable only after the claiming window is closed.
     */
    function withdrawUnclaimedFunds() external onlyOwner onlyInState(State.CLAIMING_CLOSED) {
        uint256 unclaimedFunds = address(this).balance;
        payable(owner()).transfer(unclaimedFunds);
    }

    /**
     * @notice Allows the owner to retrieve any ERC-20 tokens that were sent to the contract by accident.
     * @param tokenAddress The address of an ERC-20 token contract.
     */
    function rescueTokens(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));

        require(balance > 0, "AuctionRaffle: no tokens for given address");
        token.safeTransfer(owner(), balance);
    }

    /// @return A list of raffle participants; including the winners (if settled)
    function getRaffleParticipants() external view returns (uint256[] memory) {
        return _raffleParticipants;
    }

    /// @return A list of auction winner bidder IDs.
    function getAuctionWinners() external view returns (uint256[] memory) {
        return _auctionWinners;
    }

    /// @return winners A list of raffle winner bidder IDs.
    function getRaffleWinners() external view onlyInState(State.RAFFLE_SETTLED) returns (uint256[] memory winners) {
        uint256 participantsCount = _raffleParticipants.length;
        uint256 raffleWinnersCount = _raffleWinnersCount;
        uint256 n = participantsCount < raffleWinnersCount ? participantsCount : raffleWinnersCount;
        uint256 randomSeed = _randomSeed;

        winners = new uint256[](n);
        for (uint256 i; i < n; ++i) {
            // Map inverse `i`th place winner -> original index
            uint256 winnerIndex = FeistelShuffleOptimised.deshuffle(i, participantsCount, randomSeed, 4);
            // Map original participant index -> bidder id
            uint256 winningBidderId = _raffleParticipants[winnerIndex];
            // Record winner in storage
            winners[i] = winningBidderId;
        }
    }

    function getBid(address bidder) external view returns (Bid memory) {
        Bid storage bid_ = _bids[bidder];
        require(bid_.bidderID != 0, "AuctionRaffle: no bid by given address");
        return bid_;
    }

    function getBidByID(uint256 bidderID) external view returns (Bid memory) {
        address bidder = getBidderAddress(bidderID);
        return _bids[bidder];
    }

    function getBidsWithAddresses() external view returns (BidWithAddress[] memory) {
        uint256 totalBids = getBiddersCount();

        BidWithAddress[] memory bids = new BidWithAddress[](totalBids);

        for (uint256 i = 1; i <= totalBids; ++i) {
            BidWithAddress memory bid_ = getBidWithAddress(i);
            bids[i - 1] = bid_;
        }

        return bids;
    }

    function getBidWithAddress(uint256 bidderID) public view returns (BidWithAddress memory) {
        address bidder = getBidderAddress(bidderID);
        Bid storage bid_ = _bids[bidder];

        BidWithAddress memory bidWithAddress = BidWithAddress({bidder: bidder, bid: bid_});

        return bidWithAddress;
    }

    /// @return Address of bidder account for given bidder ID.
    function getBidderAddress(uint256 bidderID) public view returns (address payable) {
        address payable bidderAddress = _bidders[bidderID];
        require(bidderAddress != address(0), "AuctionRaffle: bidder with given ID does not exist");
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

    /**
     * @notice Adds a bid to the heap if it isn't full or the heap key is greater than `_minKeyValue`.
     * @dev Updates _minKeyIndex and _minKeyValue if needed.
     * @param bidderID Unique bidder ID
     * @param amount The bid amount
     */
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

    /**
     * @notice Updates an existing bid or replaces an existing bid with a new one in the heap.
     * @dev Updates _minKeyIndex and _minKeyValue if needed.
     * @param bidderID Unique bidder ID
     * @param oldAmount Previous bid amount
     * @param newAmount New bid amount
     */
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

    /**
     * Record auction winner, and additionally remove them from the raffle
     * participants list.
     * @param bidderID Unique bidder ID
     */
    function addAuctionWinner(uint256 bidderID) private {
        address bidderAddress = getBidderAddress(bidderID);
        _bids[bidderAddress].isAuctionWinner = true;
        _auctionWinners.push(bidderID);
        emit NewAuctionWinner(bidderID);
        removeRaffleParticipant(_bids[bidderAddress].raffleParticipantIndex);
    }

    /**
     * Determine the WinType of a bid, i.e. whether a bid is an auction winner,
     * a golden ticket winner, a raffle winner, or a loser.
     * @param bidderID Monotonically-increasing unique bidder identifier
     */
    function getBidWinType(uint256 bidderID) public view returns (WinType) {
        if (uint8(getState()) < uint8(State.AUCTION_SETTLED)) {
            return WinType.LOSS;
        }

        address bidderAddress = getBidderAddress(bidderID);
        Bid memory bid_ = _bids[bidderAddress];
        if (bid_.isAuctionWinner) {
            return WinType.AUCTION;
        }

        uint256 participantsCount = _raffleParticipants.length;
        uint256 raffleWinnersCount = _raffleWinnersCount;
        uint256 n = participantsCount < raffleWinnersCount ? participantsCount : raffleWinnersCount;
        // Map original index -> inverse `i`th place winner
        uint256 place = FeistelShuffleOptimised.shuffle(bid_.raffleParticipantIndex, participantsCount, _randomSeed, 4);
        if (place == 0) {
            return WinType.GOLDEN_TICKET;
        } else if (place < n) {
            return WinType.RAFFLE;
        } else {
            return WinType.LOSS;
        }
    }

    /**
     * @notice Removes a participant from _raffleParticipants array.
     * @dev Swaps _raffleParticipants[index] with the last one, then removes the last one.
     * @param index The index of raffle participant to remove
     */
    function removeRaffleParticipant(uint256 index) private {
        uint256 participantsLength = _raffleParticipants.length;
        require(index < participantsLength, "AuctionRaffle: invalid raffle participant index");
        uint256 lastBidderID = _raffleParticipants[participantsLength - 1];
        _raffleParticipants[index] = lastBidderID;
        _bids[_bidders[lastBidderID]].raffleParticipantIndex = uint240(index);
        _raffleParticipants.pop();
    }

    /**
     * @notice Calculates unique heap key based on bidder ID and bid amount. The key is designed so that higher bids
     * are assigned a higher key value. In case of a draw in bid amount, lower bidder ID gives a higher key value.
     * @dev The difference between `_bidderMask` and bidderID is stored in lower bits of the returned key.
     * Bid amount is stored in higher bits of the returned key.
     * @param bidderID Unique bidder ID
     * @param amount The bid amount
     * @return Unique heap key
     */
    function getKey(uint256 bidderID, uint256 amount) private pure returns (uint256) {
        return (amount << _bidderMaskLength) | (_bidderMask - bidderID);
    }

    /**
     * @notice Extracts bidder ID from a heap key
     * @param key Heap key
     * @return Extracted bidder ID
     */
    function extractBidderID(uint256 key) private pure returns (uint256) {
        return _bidderMask - (key & _bidderMask);
    }
}
