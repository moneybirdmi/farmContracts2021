pragma solidity 0.6.12;

import "@pancakeswap/pancake-swap-lib/contracts/access/Ownable.sol";

contract RateOracle is Ownable {
    uint256 public rate;

    function updateRate(uint256 _rate) external onlyOwner {
        rate = _rate;
    }
}
