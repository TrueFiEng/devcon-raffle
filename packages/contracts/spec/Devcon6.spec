// RULES

methods {
    owner() returns address envfree
}

function callFunction(method f, env e) {
    calldataarg args;

    if (!f.isView) {
        if (f.selector == safeTransferFrom(address,address,uint256,bytes).selector) {

        } else if (f.isFallback) {
            f@withrevert(e, args);
        } else {
            f(e, args);
        }
    }
}