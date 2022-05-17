// RULES
methods {
    getWinType(address) returns (uint8) envfree
}

definition WIN_TYPE_LOSS = 0
definition WIN_TYPE_GOLDEN_TICKET = 1
definition WIN_TYPE_AUCTION = 2
definition WIN_TYPE_RAFFLE = 3

rule winTypeCanOnlyBeSetOnce(method f){
    address bidder;
    uint8 winType_old = getWinType(bidder);

    require winType_old != WIN_TYPE_LOSS;

    env e;
    calldataarg args;
    f(e, args);

    uint8 winType_new = getWinType(bidder);
    assert(winType_new == winType_old);
}