// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "../AuctionRaffle.sol";

contract AuctionRaffleMock is AuctionRaffle {
    constructor(
        address initialOwner,
        ConfigParams memory configParams,
        VRFRequesterParams memory vrfRequesterParams
    ) AuctionRaffle(initialOwner, configParams, vrfRequesterParams) {}

    function getHeap() external view returns (uint256[] memory) {
        return _heap;
    }

    function getMinKeyIndex() external view returns (uint256) {
        return _minKeyIndex;
    }

    function getMinKeyValue() external view returns (uint256) {
        return _minKeyValue;
    }

    function getBalance(address addr) external view returns (uint256) {
        return addr.balance;
    }
}
