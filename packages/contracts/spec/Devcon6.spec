// RULES
methods {
    getWinType(address) returns (uint8) envfree
    getNumberOfBids() returns (uint256) envfree
    getBiddersCount() returns (uint256) envfree
    getNumberOfRaffleParticipants() returns (uint256) envfree
    getNumberOfAuctionParticipants() returns (uint256) envfree
    getRaffleWinnersCount() returns (uint256) envfree
    getAuctionWinnersCount() returns (uint256) envfree
    getHeapMax() returns (uint256) envfree
    getBidAmount(address) returns (uint256) envfree
}

definition WIN_TYPE_LOSS() returns uint8 = 0;
definition WIN_TYPE_GOLDEN_TICKET() returns uint8 = 1;
definition WIN_TYPE_AUCTION() returns uint8 = 2;
definition WIN_TYPE_RAFFLE() returns uint8 = 3;

function callFunction(method f, env e) {
    calldataarg args;

    if (!f.isView) {
        if (f.selector == settleRaffle(uint256[]).selector) {
            uint256[] randomNumbers;

            require forall address bidder. getHeapMax() >= getBidAmount(bidder);
            require randomNumbers.length <= 2;
            require getBiddersCount() <= 2;
            require getNumberOfBids() <= 2;
            require getNumberOfRaffleParticipants() <= 1;
            require getNumberOfAuctionParticipants() <= 1;
            require getRaffleWinnersCount() <= 1;
            require getAuctionWinnersCount() <= 1;

            settleRaffle(e, randomNumbers);
        } else if (f.selector == settleAuction().selector) {

            require forall address bidder. getHeapMax() >= getBidAmount(bidder);
            require getBiddersCount() <= 2;
            require getNumberOfBids() <= 2;
            require getNumberOfRaffleParticipants() <= 1;
            require getNumberOfAuctionParticipants() <= 1;
            require getRaffleWinnersCount() <= 1;
            require getAuctionWinnersCount() <= 1;

            settleAuction(e);
        } else if (f.isFallback) {
            f@withrevert(e, args);
        } else {
            f(e, args);
        }
    }
}

rule winTypeCanOnlyBeSetOnce(method f){
    address bidder;
    uint8 winType_old = getWinType(bidder);

    require winType_old != WIN_TYPE_LOSS();

    env e;
    calldataarg args;
    callFunction(f, e);

    uint8 winType_new = getWinType(bidder);
    assert(winType_new == winType_old);
}