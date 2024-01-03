// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPSD {
    /*
        Function that lets market to transfer money from buyer.
    */
    function approveMarket(address owner, address spender, uint256 amount) external returns (bool);
}