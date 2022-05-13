// RULES

methods {
    owner() returns address envfree
}

definition STATE_AWAITING_BIDDING() returns uint8 = 0;
definition STATE_BIDDING_OPEN() returns uint8 = 1;
definition STATE_BIDDING_CLOSED() returns uint8 = 2;
definition STATE_AUCTION_SETTLED() returns uint8 = 3;
definition STATE_RAFFLE_SETTLED() returns uint8 = 4;
definition STATE_CLAIMING_CLOSED() returns uint8 = 5;

rule stateTransitionCanOnlyBeMadeByOwner(method f){
    env e1;
    uint8 state_old = getState(e1);

    env e2;
    require e2.msg.sender != owner();
    require e2.block.timestamp == e1.block.timestamp;
    calldataarg args;
    f(e2, args);

    env e3;
    require e3.block.timestamp == e2.block.timestamp;
    uint8 state_new = getState(e3);

    assert(state_new == state_old);
}

rule stateTransitionCanOnlyBeForward(method f){
    env e1;
    uint8 state_old = getState(e1);

    env e2;
    require e2.msg.sender != owner();
    require e2.block.timestamp >= e1.block.timestamp;
    calldataarg args;
    f(e2, args);

    env e3;
    require e3.block.timestamp >= e2.block.timestamp;
    uint8 state_new = getState(e3);

    assert(state_new >= state_old);
}
