import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signMessage } from '@wagmi/core'


const PricePopup = ({ onClose, tokenId, walletAddress }) => {
  const [modal, setModal] = useState(true)
  const navigateTo = useNavigate()

  const toggleModal = () => {
    onClose()
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    const price = document.getElementById("price").value
    console.log(price)
    createNFTListing(price)
    toggleModal()
  }

  const getNonce = () => {
    return fetch(
      `http://193.219.91.103:6172/api/v1/db/${walletAddress}/nonce`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => console.log(err))
  }

  const createNFTListing = async (price) => {
    try {
      let nonce = await getNonce()
      console.log(nonce)
      const signature = await signMessage({
        message: `Sell NFT with connected account: ${walletAddress}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: walletAddress.toString(),
        action: 'sell',
        tokenId: parseInt(tokenId),
        price: Number(price),
      }
      console.log(requestedData)
      fetch("http://193.219.91.103:6172/api/v1/marketplace/createNFTListing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((receipt) => {
          console.log(receipt)
          if (receipt) {
            navigateTo("/marketplace/mylistings")
            // notifaction alert
          }
        })
        .catch((err) => console.log(err))
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = "unset"
    } else {
      document.body.style.overflowY = "unset"
    }
  }, [modal])

  return (
    <>
      {modal && (
        <div className="modal w-screen h-screen inset-0 fixed z-[6]">
          <div className="overlay w-screen h-screen inset-0 absolute bg-gray-700 bg-opacity-80"></div>
          <div className="modal-content absolute left-2/4 top-[40%] transform -translate-x-1/2 -translate-y-1/2 text-gold2 font-vt323 p-5 rounded w-[24rem] h-[22rem] bg-[url('../src/assets/oceantheme.jpg')]">
            <div className="flex justify-center flex-col items-center gap-[1.2rem] mt-8">
              <h2 className="font-semibold text-[2.6rem]">List NFT</h2>
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col min-w-[19.5rem]"
              >
                <label className="text-[1.6rem] font-medium">Price</label>
                <input
                  type="number"
                  id="price"
                  className="block border-2 bg-white min-h-[2.5rem] mb-[1.5rem] w-[19.5rem] text-[1.2rem]"
                  placeholder="Enter listing price"
                  maxLength="15"
                  required
                />
                <button className="rounded-sm border-solid border-2 bg-white min-h-[2rem] text-[1.2rem] mb-[1rem] w-[19.5rem] hover:text-secondary">
                  Submit
                </button>
                <button
                  className="text-[1.3rem] font-semibold absolute top-4 right-4 p-1 hover:text-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PricePopup
