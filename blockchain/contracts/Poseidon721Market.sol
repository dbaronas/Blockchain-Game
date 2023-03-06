// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract PoseidonMarket is ERC721Holder {
    address private _marketOwner;


    constructor() {
        _marketOwner = msg.sender;
    }
}