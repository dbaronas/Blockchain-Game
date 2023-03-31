// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IPSD {
    function approveMarket(address owner, address spender, uint256 amount) external returns (bool);
}