import React, { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import styles from "../style"
import MyNFTsCards from "../components/Market/MyNFTsCards"

const MyNFTs = () => {
  const [myTokens, setMyTokens] = useState([])
  const [tokenData, setTokenData] = useState([])
  const { address } = useAccount()

  useEffect(() => {
    fetchMyTokens(address)
  }, [address])

  const fetchMyTokens = (address) => {
    fetch("http://193.219.91.103:6172/api/v1/721/getMyTokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })
      .then((response) => response.json())
      .then((tokens) => {
        const tokenIdsObject = { tokenId: tokens }
        setMyTokens(tokens)
        console.log(tokens)
        const updatedTokens = tokens.map((token) => {
          return {
            tokenId: token
          }
        })
        console.log(updatedTokens)
        fetchTokenURI(tokenIdsObject, updatedTokens)
      })
      .catch((err) => console.log(err))
  }

  const fetchTokenURI = (tokenIdsObject, updatedTokens) => {
    fetch("http://193.219.91.103:6172/api/v1/721/tokenURI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tokenIdsObject),
    })
      .then((response) => response.json())
      .then((tokenURIs) => {
        tokenURIs.forEach((tokenURI, index) => {
          fetchTokenData(tokenURI, tokenIdsObject.tokenId[index], updatedTokens, index)
          console.log(tokenURI) }
        )
      })
      .catch((err) => console.log(err))
  }

  const fetchTokenData = (tokenURI, tokenId, updatedTokens, index) => {
    console.log(tokenId)
    fetch(`${tokenURI}`)
      .then((response) => response.json())
      .then((data) => {
        const updatedToken = {
          tokenId: updatedTokens[index].tokenId,
          name: data.name,
          walletAddress: address,
          description: data.description,
          image: data.image,
          rarity: data.rarity,
          ...(data.stats &&
            data.stats.fishing_speed && { fishing_speed: data.stats.fishing_speed }),
        }
        updatedTokens[index] = updatedToken
        setTokenData(updatedTokens)
      })
      .catch((err) => console.log(err))
  }


  return (
    <div>
      {myTokens.length === 0 ? (
        <div className={`${styles.flexCenter} h-[50vh] flex-col`}>
          <h3
            className={`${
              (styles.flex, styles.heading2)
            } w-full text-gold2 text-center`}
          >
            You don't have any tokens at the moment.
          </h3>
        </div>
      ) : (
        <div className="p-5 container max-[820px]:mx-auto">
          <MyNFTsCards
            tokenData={tokenData}
          />
        </div>
      )}
    </div>
  )
}

export default MyNFTs
