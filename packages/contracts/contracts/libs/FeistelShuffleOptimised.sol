// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

/// @title FeistelShuffleOptimised
/// @author kevincharm
/// @notice Feistel shuffle implemented in Yul.
library FeistelShuffleOptimised {
    error InvalidInputs();

    /// @notice Compute a Feistel shuffle mapping for index `x`
    /// @param x index of element in the list
    /// @param domain Number of elements in the list
    /// @param seed Random seed; determines the permutation
    /// @param rounds Number of Feistel rounds to perform
    /// @return resulting shuffled index
    function shuffle(
        uint256 x,
        uint256 domain,
        uint256 seed,
        uint256 rounds
    ) internal pure returns (uint256) {
        // (domain != 0): domain must be non-zero (value of 1 also doesn't really make sense)
        // (xPrime < domain): index to be permuted must lie within the domain of [0, domain)
        // (rounds is even): we only handle even rounds to make the code simpler
        if (domain == 0 || x >= domain || rounds & 1 == 1) {
            revert InvalidInputs();
        }

        assembly {
            // Calculate sqrt(s) using Babylonian method
            function sqrt(s) -> z {
                switch gt(s, 3)
                // if (s > 3)
                case 1 {
                    z := s
                    let r := add(div(s, 2), 1)
                    for {

                    } lt(r, z) {

                    } {
                        z := r
                        r := div(add(div(s, r), r), 2)
                    }
                }
                default {
                    if and(not(iszero(s)), 1) {
                        // else if (s != 0)
                        z := 1
                    }
                }
            }

            // nps <- nextPerfectSquare(domain)
            let sqrtN := sqrt(domain)
            let nps
            switch eq(exp(sqrtN, 2), domain)
            case 1 {
                nps := domain
            }
            default {
                let sqrtN1 := add(sqrtN, 1)
                // pre-check for square overflow
                if gt(sqrtN1, sub(exp(2, 128), 1)) {
                    // overflow
                    revert(0, 0)
                }
                nps := exp(sqrtN1, 2)
            }
            // h <- sqrt(nps)
            let h := sqrt(nps)
            // Allocate scratch memory for inputs to keccak256
            let packed := mload(0x40)
            mstore(0x40, add(packed, 0x80)) // 128B
            // When calculating hashes for Feistel rounds, seed and domain
            // do not change. So we can set them here just once.
            mstore(add(packed, 0x40), seed)
            mstore(add(packed, 0x60), domain)
            // Loop until x < domain
            for {

            } 1 {

            } {
                let L := mod(x, h)
                let R := div(x, h)
                // Loop for desired number of rounds
                for {
                    let i := 0
                } lt(i, rounds) {
                    i := add(i, 1)
                } {
                    // Load R and i for next keccak256 round
                    mstore(packed, R)
                    mstore(add(packed, 0x20), i)
                    // roundHash <- keccak256([R, i, seed, domain])
                    let roundHash := keccak256(packed, 0x80)
                    // nextR <- (L + roundHash) % h
                    let nextR := mod(add(L, roundHash), h)
                    L := R
                    R := nextR
                }
                // x <- h * R + L
                x := add(mul(h, R), L)
                if lt(x, domain) {
                    break
                }
            }
        }
        return x;
    }

    /// @notice Compute the inverse Feistel shuffle mapping for the shuffled
    ///     index `xPrime`
    /// @param xPrime shuffled index of element in the list
    /// @param domain Number of elements in the list
    /// @param seed Random seed; determines the permutation
    /// @param rounds Number of Feistel rounds that was performed in the
    ///     original shuffle.
    /// @return resulting shuffled index
    function deshuffle(
        uint256 xPrime,
        uint256 domain,
        uint256 seed,
        uint256 rounds
    ) internal pure returns (uint256) {
        // (domain != 0): domain must be non-zero (value of 1 also doesn't really make sense)
        // (xPrime < domain): index to be permuted must lie within the domain of [0, domain)
        // (rounds is even): we only handle even rounds to make the code simpler
        if (domain == 0 || xPrime >= domain || rounds & 1 == 1) {
            revert InvalidInputs();
        }

        assembly {
            // Calculate sqrt(s) using Babylonian method
            function sqrt(s) -> z {
                switch gt(s, 3)
                // if (s > 3)
                case 1 {
                    z := s
                    let r := add(div(s, 2), 1)
                    for {

                    } lt(r, z) {

                    } {
                        z := r
                        r := div(add(div(s, r), r), 2)
                    }
                }
                default {
                    if and(not(iszero(s)), 1) {
                        // else if (s != 0)
                        z := 1
                    }
                }
            }

            // nps <- nextPerfectSquare(domain)
            let sqrtN := sqrt(domain)
            let nps
            switch eq(exp(sqrtN, 2), domain)
            case 1 {
                nps := domain
            }
            default {
                let sqrtN1 := add(sqrtN, 1)
                // pre-check for square overflow
                if gt(sqrtN1, sub(exp(2, 128), 1)) {
                    // overflow
                    revert(0, 0)
                }
                nps := exp(sqrtN1, 2)
            }
            // h <- sqrt(nps)
            let h := sqrt(nps)
            // Allocate scratch memory for inputs to keccak256
            let packed := mload(0x40)
            mstore(0x40, add(packed, 0x80)) // 128B
            // When calculating hashes for Feistel rounds, seed and domain
            // do not change. So we can set them here just once.
            mstore(add(packed, 0x40), seed)
            mstore(add(packed, 0x60), domain)
            // Loop until x < domain
            for {

            } 1 {

            } {
                let L := mod(xPrime, h)
                let R := div(xPrime, h)
                // Loop for desired number of rounds
                for {
                    let i := 0
                } lt(i, rounds) {
                    i := add(i, 1)
                } {
                    // Load L and i for next keccak256 round
                    mstore(packed, L)
                    mstore(add(packed, 0x20), sub(sub(rounds, i), 1))
                    // roundHash <- keccak256([L, rounds - i - 1, seed, domain])
                    // NB: extra arithmetic to avoid underflow
                    let roundHash := mod(keccak256(packed, 0x80), h)
                    // nextL <- (R - roundHash) % h
                    // NB: extra arithmetic to avoid underflow
                    let nextL := mod(sub(add(R, h), roundHash), h)
                    R := L
                    L := nextL
                }
                // x <- h * R + L
                xPrime := add(mul(h, R), L)
                if lt(xPrime, domain) {
                    break
                }
            }
        }
        return xPrime;
    }
}
