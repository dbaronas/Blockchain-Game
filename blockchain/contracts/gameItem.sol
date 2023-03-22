// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GameItem is ERC1155, Ownable, ERC1155Burnable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public constant GOLD = 0;
    uint256 public constant METAL_FR = 1;
    
    struct Item {
        address owner;
        uint durability;
    }

    mapping(address => Item[]) public tokenAddress;
    
    constructor() ERC1155("http://193.219.91.103:6172/api/v1/gameitems/SFTs/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, METAL_FR, 10**9, "");
    }

    function awardItem(address to, uint256 _id, uint256 _amount, uint256 _durability) public {
        _safeTransferFrom(msg.sender, to, _id, _amount, "");
        tokenAddress[to].push(Item(to, _durability));
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}