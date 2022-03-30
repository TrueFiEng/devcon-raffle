// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.10;

library Heap {
    function parent(uint256 index) internal pure returns (uint256) {
        return (index - 1) / 2;
    }

    function left(uint256 index) internal pure returns (uint256) {
        return 2 * index + 1;
    }

    function right(uint256 index) internal pure returns (uint256) {
        return 2 * index + 2;
    }

    function insert(uint256[] storage heap, uint256 key) public {
        uint256 index = heap.length;
        heap.push(key);

        while (index > 0 && heap[parent(index)] < heap[index]) {
            (heap[parent(index)], heap[index]) = (key, heap[parent(index)]);
            index = parent(index);
        }
    }

    function increaseKey(uint256[] storage heap, uint256 oldValue, uint256 newValue) public {
        uint256 index = findKey(heap, oldValue);
        increaseKeyAt(heap, index, newValue);
    }

    function findKey(uint256[] storage heap, uint256 value) public view returns (uint256) {
        for (uint256 i = 0; i < heap.length; ++i) {
            if (heap[i] == value) {
                return i;
            }
        }
        revert("Heap: key with given value not found");
    }

    function increaseKeyAt(uint256[] storage heap, uint256 index, uint256 newValue) public {
        heap[index] = newValue;

        while (index > 0 && heap[parent(index)] < heap[index]) {
            (heap[parent(index)], heap[index]) = (newValue, heap[parent(index)]);
            index = parent(index);
        }
    }

    function removeMax(uint256[] storage heap) public returns (uint256 max) {
        require(heap.length > 0, "Heap: cannot remove max element from empty heap");
        max = heap[0];
        if (heap.length == 1) {
            heap.pop();
            return max;
        }

        heap[0] = heap[heap.length - 1];
        heap.pop();
        maxHeapify(heap, 0);
        return max;
    }

    function maxHeapify(uint256[] storage heap, uint256 i) internal {
        uint256 l = left(i);
        uint256 r = right(i);
        uint256 biggest = i;
        if (l < heap.length && heap[l] > heap[i]) {
            biggest = l;
        }
        if (r < heap.length && heap[r] > heap[biggest]) {
            biggest = r;
        }
        if (biggest != i) {
            (heap[i], heap[biggest]) = (heap[biggest], heap[i]);
            minHeapify(heap, biggest);
        }
    }
}
