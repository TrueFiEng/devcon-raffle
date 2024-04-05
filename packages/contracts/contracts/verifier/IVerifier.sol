// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

interface IVerifier {
    function verify(bytes memory payload, bytes memory proof) external;
}
