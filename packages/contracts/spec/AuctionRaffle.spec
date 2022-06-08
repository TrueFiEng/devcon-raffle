// RULES

methods {
    owner() returns address envfree
    getBalance(address) returns address envfree
}

rule fundsCannotBeLocked() {
    uint256 balance = getBalance(currentContract);

    env e;
    withdrawUnclaimedFunds(e);

    assert getBalance(currentContract) == 0;
    assert getBalance(e.msg.sender) == balance;
}
