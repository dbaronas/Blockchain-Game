import React, { useState } from 'react'
import styles from '../../style'

const Card = ({ id, owner, imageUrl}) => {

  const [isHovered, setIsHovered] = useState(false)

  const hnadleMouseHover = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  return (
    <div
      className="w-5/6 min-[280px]:mx-auto rounded overflow-hidden shadow-lg h-80 sm:h-96 md:h-96 lg:h-96 sm:w-full md:w-full lg:w-full
      box-border shadow-yellow-500 m-2 relative"
      onMouseEnter={hnadleMouseHover}
      onMouseLeave={handleMouseLeave}
    >
      <img src={imageUrl} alt={id} className="w-full sm:w-full md:w-full lg:w-full h-48 sm:h-64 md:h-64 lg:h-64 object-center" />
      <div className="px-6 py-4">
        <div className="font regular text-xl mb-2 text-gold2">{owner}</div>
        <div className="font regular text-lg mb-0 text-gold2">{id} ETH</div>
      </div>
          {isHovered && (
          <div className={`${styles.flexCenter} w-full absolute bottom-[0.04rem] ease-in-out duration-900 z-2`}>
            <button className="w-full background-gold text-white font-bold py-2 px-4 rounded">
              Buy
            </button>
          </div>
          )}
    </div>
  )
}

export default Card