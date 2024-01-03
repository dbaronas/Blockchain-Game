// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IPSD.sol";

contract PoseidonToken is ERC20, ERC20Burnable, AccessControl, IPSD {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant MARKET_ROLE = keccak256("MARKET_ROLE");

    address marketAddress;

    constructor(address _market) ERC20("PoseidonToken", "PSD") {
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
        _grantRole(MARKET_ROLE, _market);
        _mint(msg.sender, 1000000000000000 * 10 ** decimals());
    }

    function mint(address _to, uint256 _amount) public onlyRole(MINTER_ROLE) {
        _mint(_to, _amount);
    }

    function approveMarket(
        address _owner,
        address _spender,
        uint256 _amount
    ) public virtual override onlyRole(MARKET_ROLE) returns (bool) {
        _approveMarket(_owner, _spender, _amount);
        return true;
    }

    function _approveMarket(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal virtual {
        _approve(_owner, _spender, _amount);
    }
}
