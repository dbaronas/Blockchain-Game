// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPNFT {
    /*
        Function that lets market to transfer money from buyer.
    */
    function approveMarket(address operator, uint256 tokenId) external returns (bool);
}