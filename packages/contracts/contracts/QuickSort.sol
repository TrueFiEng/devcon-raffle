pragma solidity 0.8.10;

contract QuickSort {
    uint256[] public a;

    constructor(uint256[] memory _arr) {
        a = _arr;
    }

    function getArray() public view returns (uint256[] memory) {
        return a;
    }

    function getArrayLength() public view returns (uint256) {
        return a.length;
    }

    function add(uint256[] memory arr) public {
        for (uint256 i = 0; i < arr.length; i++) {
            a.push(arr[i]);
        }
    }

    function sort() public {
        if (a.length > 0) {
            uint256[] memory arr = a;
            quickSort(arr, 0, arr.length - 1);
            a = arr;
        }
    }

    function quickSort(
        uint256[] memory arr,
        uint256 left,
        uint256 right
    ) internal {
        if (left >= right) return;
        uint256 p = arr[(left + right) / 2]; // p = the pivot element
        uint256 i = left;
        uint256 j = right;
        while (i < j) {
            while (arr[i] < p) ++i;
            while (arr[j] > p) --j; // arr[j] > p means p still to the left, so j > 0
            if (arr[i] > arr[j]) (arr[i], arr[j]) = (arr[j], arr[i]);
            else ++i;
        }

        // Note --j was only done when a[j] > p.  So we know: a[j] == p, a[<j] <= p, a[>j] > p
        if (j > left) quickSort(arr, left, j - 1); // j > left, so j > 0
        quickSort(arr, j + 1, right);
    }
}
