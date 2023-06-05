import React from "react"
import { useGlobalState } from "./NotificationManagement"

const LoadingPopup = () => {
  const [loading] = useGlobalState("loading")

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen
        flex items-center justify-center bg-black 
        bg-opacity-50 transform transition-transform
        duration-300 ${loading.show ? "scale-100" : "scale-0"}`}
    >
      <div
        className="flex flex-col justify-center
          items-center bg-[#151c25] shadow-xl 
          shadow-yellow-600 rounded-xl 
          min-w-min px-10 pb-2 border border-yellow-600 z-[14]"
      >
        <div className="flex flex-row justify-center items-center">
          <div className="lds-dual-ring scale-50"></div>
          <p className="text-lg text-white">Processing...</p>
        </div>
        <small className="text-white text-[1rem] text-center">
          {loading.msg}
        </small>
      </div>
    </div>
  )
}

export default LoadingPopup
