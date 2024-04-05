// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IVerifier} from "./IVerifier.sol";

contract ScoreAttestationVerifier is IVerifier, EIP712, Ownable {
    /// @notice EIP-712 typehash for Score message
    bytes32 public constant EIP712_SCORE_TYPEHASH = keccak256("Score(address subject,uint256 score)");

    /// @notice Address of the authorised attestor
    address public attestor;
    /// @notice Minimum required GTC passport score (8 decimals)
    uint256 public requiredScore;

    event RequiredScoreUpdated(uint256 oldScore, uint256 newScore);
    event AttestorUpdated(address oldAttestor, address newAttestor);

    constructor(
        string memory version,
        address initialAttestor,
        uint256 initialRequiredScore
    ) EIP712("ScoreAttestationVerifier", version) Ownable() {
        requiredScore = initialRequiredScore;
        attestor = initialAttestor;
    }

    function verify(bytes memory payload, bytes memory proof) external view {
        (address subject, uint256 score) = abi.decode(payload, (address, uint256));
        bytes32 digest = _hashTypedDataV4(keccak256(abi.encode(EIP712_SCORE_TYPEHASH, subject, score)));
        address signer = ECDSA.recover(digest, proof);
        require(signer == attestor, "Unauthorised attestor");
        require(score >= requiredScore, "Score too low");
    }

    function setRequiredScore(uint256 newRequiredScore) external onlyOwner {
        emit RequiredScoreUpdated(requiredScore, newRequiredScore);
        requiredScore = newRequiredScore;
    }

    function setAttestor(address newAttestor) external onlyOwner {
        emit AttestorUpdated(attestor, newAttestor);
        attestor = newAttestor;
    }
}
