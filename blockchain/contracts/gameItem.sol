// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GameItem is ERC1155, Ownable, ERC1155Burnable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address marketContract;

    uint256 public constant GOLD = 0;
    uint256 public constant STARTER_FISHING_ROD = 1;
    uint256 public constant METAL_FISHING_ROD = 2;
    
    constructor(address _marketContract) ERC1155("http://193.219.91.103:6172/api/v1/gameitems/SFTs/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, STARTER_FISHING_ROD, 10**9, "");
        _mint(msg.sender, METAL_FISHING_ROD, 10**9, "");
        marketContract = _marketContract;
    }

    function awardItem(address to, uint256 _id, uint256 _amount) public onlyOwner {
        _safeTransferFrom(msg.sender, to, _id, _amount, "");
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