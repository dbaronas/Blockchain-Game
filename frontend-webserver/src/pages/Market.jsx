import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import MarketCards from '../components/Market/MarketCards'
import styles from '../style'
// import { useBalance } from 'wagmi'

const Market = () => {
  const [allListings, setAllListings] = useState([])
  const [listingsData, setListingsData] = useState([])
  let { address } = useAccount()
  // const balance = useBalance({
  //   address: `${address}`,
  //   token: '0x5b1869D9A4C187F2EAa108f3062412ecf0526b24',
  //   enabled: false
  // })
  // console.log(balance)

  const fetchAllListings = () => {
    fetch("http://193.219.91.103:6172/api/v1/marketplace/NFTListings")
      .then(response => response.json())
      .then(listings => {
        console.log(listings)
        getListingData(listings)
        setAllListings(listings)
      })
  }

  const getListingData = (listings) => {
    const allTokensIds = listings.map((listing) => listing.tokenId)
    const tokenIdsObject = {
      tokenId: allTokensIds
    }
    const updatedListings = [...listings]
    console.log(updatedListings)
    fetchTokenURI(tokenIdsObject, updatedListings)
  }

  const fetchTokenURI = (tokenIdsObject, updatedListings) => {
    console.log(updatedListings)
    fetch("http://193.219.91.103:6172/api/v1/721/tokenURI", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tokenIdsObject)
    })
        .then(response => response.json())
        .then(tokenURIs => {
            tokenURIs.forEach((tokenURI, index) => {
              fetchTokenData(tokenURI, tokenIdsObject.tokenId[index], updatedListings, index)
            })   
        })
        .catch(err => console.log(err))
  }
  
  const fetchTokenData = (tokenURI, tokenId, updatedListings, index) => {
    fetch(`${tokenURI}`)
      .then(response => response.json())
      .then(data => {
        const updatedListing = {
          listingId: updatedListings[index].listingId,
          seller: updatedListings[index].seller,
          contract: updatedListings[index].contract,
          tokenId: updatedListings[index].tokenId,
          quantity: updatedListings[index].quantity,
          price: updatedListings[index].price,
          name: data.name,
          description: data.description,
          image: data.image,
          rarity: data.rarity,
          ...(data.stats && data.stats.fishing_speed && { fishing_speed: data.stats.fishing_speed })
        }
        updatedListings[index] = updatedListing
        setListingsData(updatedListings)
      })
      .catch(err => console.log(err))
  }
  
  
  useEffect(() => {
    fetchAllListings()
  }, [address])

  
  return (
    <div>
      {allListings.length === 0 ? (
        <div className={`${styles.flexCenter} flex-col h-[50vh]`}>
          <h3
            className={`${styles.flex} ${styles.heading2}
            } w-full text-gold2 text-center`}
          >
            Currently there are no NFTs for sale.
          </h3>
        </div>
      ) : (
        <div className="p-5 container max-[820px]:mx-auto">
          <MarketCards
            listingsData={listingsData}
          />
        </div>
      )}
    </div>
  )
}

export default Market