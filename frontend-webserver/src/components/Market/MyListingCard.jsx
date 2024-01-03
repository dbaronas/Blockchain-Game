import React, { useState, useContext } from 'react'
import styles from '../../style'
import { MarketContext } from './MarketContext'
import { useNavigate } from 'react-router-dom'


const MyListingCard = ({listingId, walletAddress, tokenId, quantity,
  price, image, name, description, fishing_speed }) => {

  const [isHovered, setIsHovered] = useState(false)
  const { setSelectedCard } = useContext(MarketContext)
  const navigateTo = useNavigate()

  const handleMouseHover = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleViewDetailsButtonClick = () => {
    setSelectedCard({ listingId, walletAddress, tokenId, quantity, price, image, name, description, fishing_speed })
    const dynamicRoute = `/marketplace/mylistings/${walletAddress}/${tokenId}`
    navigateTo(dynamicRoute)
  }
  

  return (
    <div
      className="w-5/6 min-[280px]:mx-auto rounded overflow-hidden shadow-lg h-80 sm:h-96 md:h-96 lg:h-96 sm:w-full md:w-full lg:w-full
      box-border shadow-yellow-500 m-2 relative border-2 border-yellow-500"
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
    >
      <img src={image} alt={name} className="w-full sm:w-full md:w-full lg:w-full h-48 sm:h-64 md:h-64 lg:h-64 object-center" />
      <div className="px-6 py-4">
        <div className="font regular text-lg text-gold2 mb-2">{name}</div>
        <div className="font regular text-lg text-gold2 mb-2">{price} PSD</div>
      </div>
          {isHovered && (
          <div className={`${styles.flexCenter} w-full absolute bottom-[0.04rem] ease-in-out duration-900 z-2`}>
            <button className="w-full background-gold text-white font-bold py-2 px-4 rounded" onClick={handleViewDetailsButtonClick}>
              View details
            </button>
          </div>
          )}
    </div>
  )
}

export default MyListingCard