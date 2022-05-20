// RULES
import "StateTransitions.spec"

methods {
    getBalance(address) returns uint256 envfree
    getBidderAddress(uint256) returns address envfree
    getBiddersCount() returns uint256 envfree
    claimingEndTime() returns uint256 envfree
}

// RULES

rule biddersCountNeverDecreases(method f) {
    uint256 biddersLengthGhost_old = biddersLengthGhost;
    uint256 bidsLengthGhost_old = bidsLengthGhost;
    uint256 biddersCount_old = getBiddersCount();

    env e;
    callFunction(f, e);

    assert biddersLengthGhost >= biddersLengthGhost_old;
    assert bidsLengthGhost >= bidsLengthGhost_old;
    assert getBiddersCount() >= biddersCount_old;
}

// withdrawUnclaimedFunds rules

rule fundsCannotBeLocked() {
    uint256 balance = getBalance(currentContract);

    env e;
    withdrawUnclaimedFunds(e);

    assert getBalance(currentContract) == 0;
    assert getBalance(e.msg.sender) == balance;
}

// claim rules

rule claimChecksStateIsRaffleSettled() {
    uint256 bidderID;

    env e1;
    require getState(e1) != STATE_RAFFLE_SETTLED();

    env e2;
    require e2.block.timestamp == e1.block.timestamp;
    claim@withrevert(e2, bidderID);

    assert lastReverted;
}

rule claimIncreasesBidderBalance() {
    uint256 bidderID;
    address bidderAddress = getBidderAddress(bidderID);
    uint256 balance_old = getBalance(bidderAddress);

    env e;
    claim(e, bidderID);

    assert getBalance(bidderAddress) > balance_old;
}


//invariant biddersLengthGhostEqualsBidsLengthGhost()
//    biddersLengthGhost == bidsLengthGhost
//    filtered { f -> !f.isFallback }

//definition test1(address bidderAddress, uint256 bidderID) returns bool = getBidderID(bidderAddress) == bidderID <=> getBidderAddress(bidderID) == bidderAddress;
//definition test2(uint256 bidderID) returns bool = bidsLengthGhost > bidderID;

//invariant test(address bidderAddress, uint256 bidderID)
//    (bidsLengthGhost <= 2^128 && getBidderAddress(bidderID) != 0) => (test2(bidderID) && test1(bidderAddress, bidderID))
//    filtered { f -> !f.isFallback }

// TODO: finish this rule when Certora fixes CALL_STACK issue
//rule claimChecksBidIsClaimed() {
//    address bidderAddress;
//    require bidClaimedGhost[bidderAddress] == true;

//    env e;
//    uint256 _bidderId;
//    uint256 _amount;
//    uint8 _winType;
//    bool _claimed;
//    _bidderId, _amount, _winType, _claimed = getBid(e, bidderAddress);

//    requireInvariant test(bidderAddress, _bidderId);

//    env e1;
//    require e1.block.timestamp >= e.block.timestamp;
//    claim@withrevert(e1, _bidderId);

//    assert lastReverted;
//}


function callFunction(method f, env e) {
    calldataarg args;

    if (!f.isView) {
        if (f.isFallback) {
            f@withrevert(e, args);
        } else {
            f(e, args);
        }
    }
}

// GHOSTS

ghost uint256 bidsLengthGhost {
    init_state axiom bidsLengthGhost == 0;
}
hook Sstore _bids.(offset 0) uint256 value STORAGE {
    bidsLengthGhost = value;
}
hook Sload uint256 value _bids.(offset 0) STORAGE {
    require value == bidsLengthGhost;
}

ghost uint256 biddersLengthGhost {
    init_state axiom biddersLengthGhost == 0;
}
hook Sstore _bidders.(offset 0) uint256 value STORAGE {
    biddersLengthGhost = value;
}
hook Sload uint256 value _bidders.(offset 0) STORAGE {
    require value == biddersLengthGhost;
}

