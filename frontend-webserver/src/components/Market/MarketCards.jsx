import React, { useRef } from "react"
import { LoadingCards } from "./LoadingCards"
import clsx from "clsx"
import useLazyLoad from "./useLazyLoad"
import MarketCard from "./MarketCard"
import useWindowSize from "./useWindowSize"

const MarketCards = ({ listingsData }) => {
  const nfts = listingsData
  const triggerRef = useRef(null)
  const { width } = useWindowSize()
  let cardsPerPage = 4

  if (width >= 1700) {
    cardsPerPage = 5
  } else if (width >= 1200) {
    cardsPerPage = 4
  } else if (width >= 1060) {
    cardsPerPage = 3
  } else if (width <= 860) {
    cardsPerPage = 2
  } else if (width >= 625) {
    cardsPerPage = 2
  } else if (width >= 280) {
    cardsPerPage = 1
  }

  const onGrabData = (currentPage) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const startIndex = (currentPage - 1) * cardsPerPage
        const endIndex = startIndex + cardsPerPage
        const data = nfts.slice(startIndex, endIndex)
        resolve(data)
      }, 1000)
    })
  }

  const { data, loading } = useLazyLoad({ triggerRef, onGrabData })
  console.log(data)

  return (
    <>
      <div
        className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5
     gap-4 content-start min-[280px]:grid-cols-1 min-[625px]:grid-cols-2 mb-2"
      >
        {data.map((listing, index) => {
          return (
            <MarketCard
              key={index}
              listingId={listing.listingId}
              walletAddress={listing.seller}
              tokenId={listing.tokenId}
              quantity={listing.quantity}
              price={listing.price}
              image={listing.image}
              name={listing.name}
              description={listing.description}
              fishing_speed={listing.fishing_speed}
            />
          )
        })}
      </div>
      {/* clsx dynamically generates classes using conditions for data fetching */}
      {data.length < nfts.length && (
        <div ref={triggerRef} className={clsx("trigger", { visible: loading })}>
          <LoadingCards />
        </div>
      )}
    </>
  )
}

export default MarketCards
