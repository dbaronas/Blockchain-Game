import { useContext, useEffect, useState } from "react"
import { MarketContext } from "./MarketContext"
import { useNavigate } from "react-router-dom"
import { useAccount } from 'wagmi'
import PricePopup from "./PricePopup"


const MyTokenDetails = () => {

  const { selectedCard } = useContext(MarketContext)
  const navigateTo = useNavigate()
  let { address } = useAccount()
  const [isOwner, setIsOwner] = useState(false)
  const [showPricePopup, setShowPricePopup] = useState(false)


  useEffect(() => {
    if (!selectedCard || selectedCard === null) {
      navigateTo("/marketplace/mynfts", { replace: true })
    }
  }, [selectedCard, navigateTo])


  useEffect(() => {
    if (selectedCard && selectedCard.walletAddress === address) {
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }
  }, [selectedCard, address])

  
  const handleListNFTClick = () => {
    setShowPricePopup(true)
  }


  if (!selectedCard || selectedCard === null) {
    return <div>Loading...</div>
  }

  const { tokenId, name, walletAddress, description, image, rarity, fishing_speed } = selectedCard
  

  return (
    <div className="text-white flex flex-row p-3 justify-center items-center">
      <div className="basis-2/6 p-2">
        <img
          src={image}
          alt={name}
          className="w-full shadow-yellow-500 border-2 rounded-lg shadow-lg border-yellow-500"
        />
      </div>
      <div className="flex flex-col gap-4 items-center justify-center basis-3/6 p-3">
        <h1 className="text-gold2 font-vt323 font-normal text-[1.5rem]">
          <i className="fa fa-check-circle text-gold3 p-1 text-[1rem]"></i>MetaOcean
        </h1>
        <p>Token ID: #{tokenId}</p>
        <p>
          Owned by <span className="text-gold3">{walletAddress}</span>
        </p>
        <div className="flex justify-center flex-col border border-yellow-500 gap-3 rounded-lg shadow-yellow-500 shadow-md">
          <p className="text-gold3 border border-yellow-500 p-2">
            <i className="fas fa-align-justify pr-2 pb-2 text-gold3"></i>
            Description
          </p>
          <p className="p-2">{description}</p>
          {fishing_speed && (
            <p className="pl-2 pb-2">Fishing speed: {fishing_speed}</p>
          )}
        </div>
        {isOwner && (
          <button className="w-1/3 background-gold text-white font-bold py-2 px-4 rounded" onClick={handleListNFTClick}>
            Sell
          </button>
        )}
      </div>
      {showPricePopup && <PricePopup onClose={() => setShowPricePopup(false)} tokenId={tokenId} walletAddress={walletAddress}/>}
    </div>
  )
}

export default MyTokenDetails
