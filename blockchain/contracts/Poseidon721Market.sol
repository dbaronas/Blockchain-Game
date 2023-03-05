// contracts/MyContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract MyContract is ERC1155Holder {
    address private _marketOwner;


    constructor() {
        _marketOwner = msg.sender;
    }
}