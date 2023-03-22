// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PoseidonMarket is ERC1155, Ownable, IERC721Receiver {
    struct Sale {
        address seller;
        address tokenContract;
        uint256 tokenId;
        uint256 quantity;
        uint256 price;
    }

    mapping (uint256 => Sale) public sales;
    uint256 public nextSaleId = 1;

    event SaleCreated(uint256 saleId, address seller, address tokenContract, uint256 tokenId, uint256 quantity, uint256 price);
    event SaleUpdated(uint256 saleId, uint256 quantity, uint256 price);
    event SaleCancelled(uint256 saleId);
    event SaleSold(uint256 saleId, address buyer);

    constructor() ERC1155("") {}

    function createSale(address tokenContract, uint256 tokenId, uint256 quantity, uint256 price) public {
        require(quantity > 0, "Quantity must be greater than 0");
        require(price > 0, "Price must be greater than 0");

        if (IERC165(tokenContract).supportsInterface(type(IERC721).interfaceId)) {
            IERC721(tokenContract).safeTransferFrom(msg.sender, address(this), tokenId);
            require(IERC721(tokenContract).ownerOf(tokenId) == address(this), "Failed to receive ERC721 token");
        } else {
            ERC1155(tokenContract).safeTransferFrom(msg.sender, address(this), tokenId, quantity, "");
            require(ERC1155(tokenContract).balanceOf(address(this), tokenId) >= quantity, "Failed to receive ERC1155 tokens");
        }

        uint256 saleId = nextSaleId;
        nextSaleId++;

        Sale memory sale = Sale(msg.sender, tokenContract, tokenId, quantity, price);
        sales[saleId] = sale;

        emit SaleCreated(saleId, msg.sender, tokenContract, tokenId, quantity, price);
    }

    function updateSale(uint256 saleId, uint256 quantity, uint256 price) public {
        require(quantity > 0, "Quantity must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(sales[saleId].seller == msg.sender, "Only the seller can update the sale");

        sales[saleId].quantity = quantity;
        sales[saleId].price = price;

        emit SaleUpdated(saleId, quantity, price);
    }

    function cancelSale(uint256 saleId) public {
        require(sales[saleId].seller == msg.sender, "Only the seller can cancel the sale");

        if (IERC165(sales[saleId].tokenContract).supportsInterface(type(IERC721).interfaceId)) {
            IERC721(sales[saleId].tokenContract).safeTransferFrom(address(this), msg.sender, sales[saleId].tokenId);
            require(IERC721(sales[saleId].tokenContract).ownerOf(sales[saleId].tokenId) == msg.sender, "Failed to return ERC721 token");
        } else {
            ERC1155(sales[saleId].tokenContract).safeTransferFrom(address(this), msg.sender, sales[saleId].tokenId, sales[saleId].quantity, "");
            require(ERC1155(sales[saleId].tokenContract).balanceOf(msg.sender, sales[saleId].tokenId) >= sales[saleId].quantity, "Failed to return ERC1155 tokens");
        }
        delete sales[saleId];

        emit SaleCancelled(saleId);
    }

    function buy(uint256 saleId, uint256 quantity) public payable {
        Sale memory sale = sales[saleId];

        require(sale.seller != address(0), "Sale does not exist");
        require(quantity > 0 && quantity <= sale.quantity, "Invalid quantity");
        require(msg.value == sale.price * quantity, "Insufficient payment");

        if (IERC165(sale.tokenContract).supportsInterface(type(IERC721).interfaceId)) {
            IERC721(sale.tokenContract).safeTransferFrom(address(this), msg.sender, sale.tokenId);
            require(IERC721(sale.tokenContract).ownerOf(sale.tokenId) == msg.sender, "Failed to transfer ERC721 token");
        } else {
            ERC1155(sale.tokenContract).safeTransferFrom(address(this), msg.sender, sale.tokenId, quantity, "");
            require(ERC1155(sale.tokenContract).balanceOf(msg.sender, sale.tokenId) >= quantity, "Failed to transfer ERC1155 tokens");
        }

        address payable seller = payable(sale.seller);
        seller.transfer(msg.value);

        if (quantity < sale.quantity) {
            sales[saleId].quantity -= quantity;
            emit SaleUpdated(saleId, sales[saleId].quantity, sale.price);
        } else {
            delete sales[saleId];
            emit SaleSold(saleId, msg.sender);
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function getAllERC721Sales() public view returns (Sale[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextSaleId; i++) {
            if (sales[i].tokenContract != address(0) && IERC165(sales[i].tokenContract).supportsInterface(type(IERC721).interfaceId)) {
                count++;
            }
        }
        Sale[] memory result = new Sale[](count);
        uint256 j = 0;
        for (uint256 i = 1; i < nextSaleId; i++) {
            if (sales[i].tokenContract != address(0) && IERC165(sales[i].tokenContract).supportsInterface(type(IERC721).interfaceId)) {
                result[j] = sales[i];
                j++;
            }
        }
        return result;
    }

    function getAllERC1155Sales() public view returns (Sale[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextSaleId; i++) {
            if (sales[i].tokenContract != address(0) && !IERC165(sales[i].tokenContract).supportsInterface(type(IERC721).interfaceId)) {
                count++;
            }
        }
        Sale[] memory result = new Sale[](count);
        uint256 j = 0;
        for (uint256 i = 1; i < nextSaleId; i++) {
            if (sales[i].tokenContract != address(0) && !IERC165(sales[i].tokenContract).supportsInterface(type(IERC721).interfaceId)) {
                result[j] = sales[i];
                j++;
            }
        }
        return result;
    }
}
