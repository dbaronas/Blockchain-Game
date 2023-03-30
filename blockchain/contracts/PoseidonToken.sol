// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoseidonToken is ERC20, ERC20Burnable, Ownable {
    address marketAddress;
    constructor(address _marketAddress) ERC20("PoseidonToken", "PSD") {
        _mint(msg.sender, 1000000000000000 * 10 ** decimals());
        marketAddress = _marketAddress;
        approve(marketAddress, 2**256 - 1);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}