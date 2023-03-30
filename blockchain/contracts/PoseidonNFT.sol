// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PoseidonNFT is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address marketContract;
    event NFTMinted(uint256);

    struct NFT {
        uint tokenId;
        string tokenName;
        address owner;
        uint256 durability;
    }

    mapping(address => NFT[]) public tokenAddress;
    mapping(string => bool) public tokenExists;

    constructor(address _marketContract) ERC721("PoseidonNFT", "PNFT") {
        marketContract = _marketContract;
    }

    function mint(
        string memory uri,
        string calldata _tokenName,
        uint256 _durability
    ) public {
        require(!tokenExists[_tokenName], "Token already exists!");
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        setApprovalForAll(marketContract, true);

        tokenAddress[msg.sender].push(NFT(tokenId, _tokenName, msg.sender, _durability));
        tokenExists[_tokenName] = true;
        emit NFTMinted(tokenId);
    }

    function getMyTokens() public view returns (NFT[] memory) {
        return tokenAddress[msg.sender];
    }

    function getDurability(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        NFT[] memory tokens = tokenAddress[ownerOf(tokenId)];
        for (uint i = 0; i < tokens.length; i++) {
            if (tokens[i].tokenId == tokenId) {
                return tokens[i].durability;
            }
        }
        revert("Token not found");
    }

    function updateDurability(uint256 tokenId, uint256 _durability) public {
        require(_exists(tokenId), "Token does not exist");
        NFT[] storage tokens = tokenAddress[ownerOf(tokenId)];
        for (uint i = 0; i < tokens.length; i++) {
            if (tokens[i].tokenId == tokenId) {
                tokens[i].durability = _durability;
                if (tokens[i].durability == 0) {
                    _burn(tokens[i].tokenId);
                    tokens[i] = tokens[tokens.length - 1];
                    tokens.pop();
                    break;
                }
            }
        }
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
