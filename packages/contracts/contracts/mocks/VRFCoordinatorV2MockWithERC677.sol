// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {VRFCoordinatorV2Mock} from "./VRFCoordinatorV2Mock.sol";
import {IERC677Receiver} from "@chainlink/contracts/src/v0.8/shared/interfaces/IERC677Receiver.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract VRFCoordinatorV2MockWithERC677 is VRFCoordinatorV2Mock, IERC677Receiver {
    address public immutable LINK;

    bool internal __entered;

    modifier nonReentrant() {
        require(!__entered, "Re-entrance not allowed");
        __entered = true;
        _;
        __entered = false;
    }

    error OnlyCallableFromLink();
    error InvalidCalldata();

    constructor(
        uint96 _baseFee,
        uint96 _gasPriceLink,
        address linkToken
    ) VRFCoordinatorV2Mock(_baseFee, _gasPriceLink) {
        LINK = linkToken;
    }

    function cancelSubscription(uint64 _subId, address _to) external override onlySubOwner(_subId) {
        uint256 balance = s_subscriptions[_subId].balance;
        emit SubscriptionCanceled(_subId, _to, balance);
        delete (s_subscriptions[_subId]);
        LinkTokenInterface(LINK).transfer(_to, balance);
    }

    function onTokenTransfer(
        address, /* sender */
        uint256 amount,
        bytes calldata data
    ) external override nonReentrant {
        if (msg.sender != address(LINK)) {
            revert OnlyCallableFromLink();
        }
        if (data.length != 32) {
            revert InvalidCalldata();
        }
        uint64 subId = abi.decode(data, (uint64));
        if (s_subscriptions[subId].owner == address(0)) {
            revert InvalidSubscription();
        }
        // We do not check that the msg.sender is the subscription owner,
        // anyone can fund a subscription.
        uint256 oldBalance = s_subscriptions[subId].balance;
        s_subscriptions[subId].balance += uint96(amount);
        emit SubscriptionFunded(subId, oldBalance, oldBalance + amount);
    }
}
