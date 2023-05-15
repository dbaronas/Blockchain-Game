import React from 'react'
import Cards from '../components/Market/Cards'

const Market = () => {

  const createNFTListing = () => {
      const requestedData = {
        "address": "0xEAD5d80e28d588eC9B677e32580AcBA9aa2D7B72",
        "tokenId": 12,
        "price": 1
      }
      fetch(`${import.meta.env.VITE_BACKEND}/api/v1/marketplace/createNFTListing`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestedData)
      })
        .then(response => response.json())
        .then(data => console.log(data))
  }

  return (
    // <button className="text-white" onClick={createNFTListing}>Sell nft</button>
    <div className="p-5 container max-[820px]:mx-auto">
        <Cards/>
    </div>
  )
}

export default Market

