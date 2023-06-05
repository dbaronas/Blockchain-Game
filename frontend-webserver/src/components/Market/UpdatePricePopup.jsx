import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signMessage } from "@wagmi/core"
import LoadingPopup from "./LoadingPopup"
import Alert from "./Alert"
import { setAlert, setLoadingMsg } from "./NotificationManagement"

const UpdatePricePopup = ({
  onClose,
  walletAddress,
  listingId,
  quantity,
  isMarket,
}) => {
  const [modal, setModal] = useState(true)
  const navigateTo = useNavigate()

  const toggleModal = () => {
    onClose()
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    const price = document.getElementById("price").value
    updateNFTListing(price)
    toggleModal()
  }

  const getNonce = () => {
    return fetch(
      `${import.meta.env.VITE_BACKEND}/api/v1/db/${walletAddress}/nonce`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => response.text())
      .then((nonce) => nonce)
      .catch((err) => console.log(err))
  }

  const updateNFTListing = async (price) => {
    try {
      let nonce = await getNonce()
      setLoadingMsg("Awaiting wallet signature approval...")
      const signature = await signMessage({
        message: `Update NFT listing price of connected account: ${walletAddress}\nnonce: ${nonce}`,
      })
      const requestedData = {
        signature: signature,
        address: walletAddress.toString(),
        action: "update",
        listingId: parseInt(listingId),
        price: Number(price),
        quantity: parseInt(quantity),
      }
      fetch(`${import.meta.env.VITE_BACKEND}/api/v1/marketplace/updateListing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestedData),
      })
        .then((response) => response.json())
        .then((receipt) => {
          if (receipt) {
            if (isMarket) {
              setAlert("Transaction has been completed")
              setTimeout(() => {
                navigateTo("/marketplace")
              }, 2000)
            } else {
              setAlert("Transaction has been completed")
              setTimeout(() => {
                navigateTo("/marketplace/mylistings")
              }, 2000)
            }
          }
        })
        .catch((err) => setAlert("Transaction has failed", "red"))
    } catch (err) {
      setAlert("Transaction has been canceled", "red")
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
              <h2 className="font-semibold text-[2.6rem]">Update price</h2>
              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col min-w-[19.5rem]"
              >
                <label className="text-[1.6rem] font-medium">Price</label>
                <input
                  type="number"
                  id="price"
                  className="block border-2 bg-white min-h-[2.5rem] mb-[1.5rem] w-[19.5rem] text-[1.2rem]"
                  placeholder="Enter new listing price"
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
      <LoadingPopup />
      <Alert />
    </>
  )
}

export default UpdatePricePopup
