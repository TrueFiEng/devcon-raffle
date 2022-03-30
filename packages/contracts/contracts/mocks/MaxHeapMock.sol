// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "../utils/MaxHeap.sol";

contract MaxHeapMock {
    using MaxHeap for uint256[];

    uint256[] heap;

    event ReturnValue(uint256 value);

    function insert(uint256 key) public {
        heap.insert(key);
    }

    function increaseKey(uint256 oldValue, uint256 newValue) public {
        heap.increaseKey(oldValue, newValue);
    }

    function removeMax() public {
        emit ReturnValue(heap.removeMax());
    }

    function getArray() public view returns (uint256[] memory) {
        return heap;
    }
}
