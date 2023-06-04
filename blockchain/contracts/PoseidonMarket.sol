// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IPSD.sol";
import "./IPNFT.sol";

contract PoseidonMarket is ERC1155, Ownable, IERC721Receiver, ReentrancyGuard {
    
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) public pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    struct Listing {
        uint256 listingId;
        address seller;
        address tokenContract;
        uint256 tokenId;
        uint256 quantity;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;
    mapping(address => uint256) public earnings;

    address coinContract;
    uint256 totalListings;

    event ListingCreated(
        uint256 listingId,
        address seller,
        address tokenContract,
        uint256 tokenId,
        uint256 quantity,
        uint256 price
    );
    event ListingUpdated(uint256 listingId, uint256 quantity, uint256 price);
    event ListingCancelled(uint256 listingId);
    event ListingSold(uint256 listingId, address buyer);
    event Withdraw(uint256 amount, uint256 timestamp);

    constructor() ERC1155("") {}

    function createListing(
        address _wallet,
        address _tokenContract,
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _price
    ) public nonReentrant {
        uint256 listingId = totalListings;
        totalListings += 1;

        require(_quantity > 0, "Quantity must be greater than 0");
        require(_price > 0, "Price must be greater than 0");

        if (getTokenType(_tokenContract) == 721) {
            IERC721(_tokenContract).safeTransferFrom(
                _wallet,
                address(this),
                _tokenId
            );
            require(
                IERC721(_tokenContract).ownerOf(_tokenId) == address(this),
                "Failed to receive ERC721 token"
            );
        } else {
            ERC1155(_tokenContract).safeTransferFrom(
                _wallet,
                address(this),
                _tokenId,
                _quantity,
                ""
            );
            require(
                ERC1155(_tokenContract).balanceOf(address(this), _tokenId) >=
                    _quantity,
                "Failed to receive ERC1155 tokens"
            );
        }

        Listing memory newListing = Listing(
            listingId,
            _wallet,
            _tokenContract,
            _tokenId,
            _quantity,
            _price
        );
        listings[listingId] = newListing;

        emit ListingCreated(
            listingId,
            _wallet,
            _tokenContract,
            _tokenId,
            _quantity,
            _price
        );
    }

    function updateListing(
        address _wallet,
        uint256 listingId,
        uint256 quantity,
        uint256 price
    ) public nonReentrant {
        require(quantity > 0, "Quantity must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(
            listings[listingId].seller == _wallet,
            "Only the seller can update the sale"
        );

        listings[listingId].quantity = quantity;
        listings[listingId].price = price;

        emit ListingUpdated(listingId, quantity, price);
    }

    function cancelListing(address _wallet, uint256 listingId) public nonReentrant {
        Listing memory targetListing = listings[listingId];
        require(
            targetListing.seller == _wallet,
            "Only the seller can cancel the sale"
        );

        if (getTokenType(targetListing.tokenContract) == 721) {
            transferListingTokens(
                address(this),
                _wallet,
                targetListing.quantity,
                targetListing
            );
            IPNFT(targetListing.tokenContract).approveMarket(address(this), targetListing.tokenId);
            require(
                IERC721(targetListing.tokenContract).ownerOf(
                    targetListing.tokenId
                ) == _wallet,
                "Failed to return ERC721 token"
            );
        } else {
            transferListingTokens(
                address(this),
                _wallet,
                targetListing.quantity,
                targetListing
            );
            require(
                ERC1155(targetListing.tokenContract).balanceOf(
                    _wallet,
                    targetListing.tokenId
                ) >= targetListing.quantity,
                "Failed to return ERC1155 tokens"
            );
        }
        delete listings[listingId];
        totalListings--;
        emit ListingCancelled(listingId);
    }

    function buy(address _wallet, uint256 listingId, uint256 quantity) public nonReentrant {
        Listing memory targetListing = listings[listingId];

        require(targetListing.seller != address(0), "Sale does not exist");
        require(
            quantity > 0 && quantity <= targetListing.quantity,
            "Invalid quantity"
        );

        if (getTokenType(targetListing.tokenContract) == 721) {
            transferListingTokens(
                address(this),
                _wallet,
                targetListing.quantity,
                targetListing
            );
            IPNFT(targetListing.tokenContract).approveMarket(address(this), targetListing.tokenId);
            require(
                IERC721(targetListing.tokenContract).ownerOf(
                    targetListing.tokenId
                ) == _wallet,
                "Failed to transfer ERC721 token"
            );
        } else {
            transferListingTokens(
                address(this),
                _wallet,
                targetListing.quantity,
                targetListing
            );
            require(
                ERC1155(targetListing.tokenContract).balanceOf(
                    _wallet,
                    targetListing.tokenId
                ) >= quantity,
                "Failed to transfer ERC1155 tokens"
            );
        }

        IPSD(coinContract).approveMarket(_wallet, address(this), targetListing.price * 10 ** 18);
        IERC20(coinContract).transferFrom(
            _wallet,
            address(this),
            targetListing.price * 10 ** 18
        );
        earnings[targetListing.seller] += targetListing.price * 10 ** 18;

        if (quantity < targetListing.quantity) {
            listings[listingId].quantity -= quantity;
            emit ListingUpdated(
                listingId,
                listings[listingId].quantity,
                targetListing.price
            );
        } else {
            delete listings[listingId];
            totalListings--;
            emit ListingSold(listingId, _wallet);
        }
    }

    function get721Listings() public view returns (Listing[] memory) {
        Listing[] memory _listings = new Listing[](totalListings);
        uint256 count = 0;

        for (uint256 i = 0; i < totalListings; i++) {
            Listing memory listing = listings[i];
            if (getTokenType(listing.tokenContract) == 721) {
                _listings[count] = listing;
                count++;
            }
        }

        Listing[] memory result = new Listing[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = _listings[i];
        }

        return result;
    }

        function get1155Listings() public view returns (Listing[] memory) {
        Listing[] memory _listings = new Listing[](totalListings);
        uint256 count = 0;

        for (uint256 i = 0; i < totalListings; i++) {
            Listing memory listing = listings[i];
            if (getTokenType(listing.tokenContract) == 1155) {
                _listings[count] = listing;
                count++;
            }
        }

        Listing[] memory result = new Listing[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = _listings[i];
        }

        return result;
    }

    function transferListingTokens(
        address _from,
        address _to,
        uint256 _quantity,
        Listing memory _listing
    ) internal {
        if (getTokenType(_listing.tokenContract) == 1155) {
            IERC1155(_listing.tokenContract).safeTransferFrom(
                _from,
                _to,
                _listing.tokenId,
                _quantity,
                ""
            );
        } else if (getTokenType(_listing.tokenContract) == 721) {
            IERC721(_listing.tokenContract).safeTransferFrom(
                _from,
                _to,
                _listing.tokenId
            );
        }
    }

    function getEarnings(address _wallet) public view returns (uint256) {
        return earnings[_wallet];
    }

    function withdraw(address _wallet) public nonReentrant {
        require(earnings[_wallet] != 0, "Nothing to withdraw");
        uint256 amount = earnings[_wallet];
        IERC20(coinContract).transfer(_wallet, (amount / 100) * 97);
        earnings[_wallet] = 0;
        emit Withdraw(amount, block.timestamp);
    }

    function getTokenType(
        address _tokenContract
    ) internal view returns (uint256) {
        if (
            IERC165(_tokenContract).supportsInterface(
                type(IERC1155).interfaceId
            )
        ) {
            return 1155;
        } else if (
            IERC165(_tokenContract).supportsInterface(type(IERC721).interfaceId)
        ) {
            return 721;
        } else {
            revert("token must be ERC1155 or ERC721.");
        }
    }

    function setCurrency(address _tokenContract) public {
        coinContract = _tokenContract;
    }

    function getCollectedFees() public view returns (uint256) {
        uint256 result = IERC20(coinContract).balanceOf(address(this));
        return result;
    }
}
