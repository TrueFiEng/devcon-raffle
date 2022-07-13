// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

contract Hashing {
    function hashTwo(bytes32 first, bytes32 second) public pure returns (bytes32) {
        return keccak256(bytes.concat(first, second));
    }
}
