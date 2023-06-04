import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import MyListingCards from '../components/Market/MyListingCards'
import styles from '../style'

const MyListings = () => {

  const [myListings, setMyListings] = useState([])
  const [listingsData, setListingsData] = useState([])
  let { address } = useAccount()

  const fetchAllListings = () => {
    fetch("http://193.219.91.103:6172/api/v1/marketplace/NFTListings")
      .then(response => response.json())
      .then(listings => {
        const ownerListings = listings.filter((listing) => listing.seller === address.toString())
        console.log(ownerListings)
        setMyListings(ownerListings)
        getMyListingsData(ownerListings)
      })
  }

  const getMyListingsData = (ownerListings) => {
    const myTokenIds = ownerListings.map((listing) => listing.tokenId)
    console.log(myTokenIds)
    const tokenIdsObject = {
      tokenId: myTokenIds
    }
    console.log(tokenIdsObject)
    fetchTokenURI(tokenIdsObject, ownerListings)
  }

  const fetchTokenURI = (tokenIdsObject, ownerListings) => {
    fetch("http://193.219.91.103:6172/api/v1/721/tokenURI", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tokenIdsObject)
    })
        .then(response => response.json())
        .then(tokenURIs => {
          console.log(tokenURIs)
            tokenURIs.forEach((tokenURI, index) => fetchTokenData(tokenURI, tokenIdsObject.tokenId[index], ownerListings, index))
        })
        .catch(err => console.log(err))
  }
  
  const fetchTokenData = (tokenURI, tokenId, ownerListings, index) => {
    fetch(`${tokenURI}`)
      .then(response => response.json())
      .then(data => {
        const ownerListing = {
          listingId: ownerListings[index].listingId,
          seller: ownerListings[index].seller,
          contract: ownerListings[index].contract,
          tokenId: ownerListings[index].tokenId,
          quantity: ownerListings[index].quantity,
          price: ownerListings[index].price,
          name: data.name,
          description: data.description,
          image: data.image,
          rarity: data.rarity,
          ...(data.stats && data.stats.fishing_speed && { fishing_speed: data.stats.fishing_speed })
        }
        ownerListings[index] = ownerListing
        setListingsData(ownerListings)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchAllListings()
  }, [address])

  
  return (
    <div>
      {myListings.length === 0 ? (
        <div className={`${styles.flexCenter} h-[50vh] flex-col`}>
          <h3
            className={`${
              (styles.flex, styles.heading2)
            } w-full text-gold2 text-center`}
          >
            You don't have any listings at the moment.
          </h3>
        </div>
      ) : (
        <div className="p-5 container max-[820px]:mx-auto">
          <MyListingCards
            listingsData={listingsData}
          />
        </div>
      )}
    </div>
  )
}

export default MyListings