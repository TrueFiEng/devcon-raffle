// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

import "../libs/MaxHeap.sol";

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

    function removeAll() public {
        uint256 size = heap.length;
        for (uint256 i = 0; i < size; ++i) {
            heap.removeMax();
        }
    }

    function findMin() public view returns (uint256 index, uint256 min) {
        return heap.findMin();
    }

    function findKey(uint256 value) public view returns (uint256) {
        return heap.findKey(value);
    }

    function getArray() public view returns (uint256[] memory) {
        return heap;
    }
}
