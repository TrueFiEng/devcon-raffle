// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

/// @title VRFRequester
/// @notice Consume Chainlink's subscription-managed VRFv2 wrapper to return a
///     random number.
abstract contract VRFRequester is VRFConsumerBaseV2 {
    struct VRFRequesterParams {
        address vrfCoordinator;
        address linkToken;
        uint256 linkPremium;
        bytes32 gasLaneKeyHash;
        uint32 callbackGasLimit;
        uint16 minConfirmations;
        uint64 subId;
    }

    /// @notice VRF Coordinator (V2)
    /// @dev https://docs.chain.link/vrf/v2/subscription/supported-networks
    address public immutable vrfCoordinator;
    /// @notice LINK token (make sure it's the ERC-677 one)
    /// @dev PegSwap: https://pegswap.chain.link
    address public immutable linkToken;
    /// @notice LINK token unit
    uint256 public immutable juels;
    /// @dev VRF Coordinator LINK premium per request
    uint256 public immutable linkPremium;
    /// @notice Each gas lane has a different key hash; each gas lane
    ///     determines max gwei that will be used for the callback
    bytes32 public immutable gasLaneKeyHash;
    /// @notice Absolute gas limit for callbacks
    uint32 public immutable callbackGasLimit;
    /// @notice Minimum number of block confirmations before VRF fulfilment
    uint16 public immutable minConfirmations;
    /// @notice VRF subscription ID; created during deployment
    uint64 public subId;
    /// @notice Inflight requestId
    uint256 public requestId;

    constructor(VRFRequesterParams memory params) VRFConsumerBaseV2(params.vrfCoordinator) {
        vrfCoordinator = params.vrfCoordinator;
        linkToken = params.linkToken;
        juels = 10**LinkTokenInterface(params.linkToken).decimals();
        linkPremium = params.linkPremium;
        gasLaneKeyHash = params.gasLaneKeyHash;
        callbackGasLimit = params.callbackGasLimit;
        minConfirmations = params.minConfirmations;
        // NB: This contract must be added as a consumer to this subscription
        subId = params.subId;
    }

    /// @notice Update VRF subscription id
    /// @param newSubId New subscription id
    function _updateSubId(uint64 newSubId) internal {
        subId = newSubId;
    }

    /// @notice Request a random number
    function _getRandomNumber() internal returns (uint256) {
        require(requestId == 0, "Request already inflight");
        uint256 requestId_ = VRFCoordinatorV2Interface(vrfCoordinator).requestRandomWords(
            gasLaneKeyHash,
            subId,
            minConfirmations,
            callbackGasLimit,
            1
        );
        requestId = requestId_;
        return requestId_;
    }

    /// @notice Callback to receive a random number from the VRF fulfiller
    /// @dev Override this function
    /// @param randomNumber Random number
    function _receiveRandomNumber(uint256 randomNumber) internal virtual {}

    /// @notice Callback function used by VRF Coordinator
    /// @dev DO NOT OVERRIDE!
    function fulfillRandomWords(uint256 requestId_, uint256[] memory randomness) internal override {
        require(requestId_ == requestId, "Unexpected requestId");
        require(randomness.length > 0, "Unexpected empty randomness");
        requestId = 0;
        _receiveRandomNumber(randomness[0]);
    }
}
