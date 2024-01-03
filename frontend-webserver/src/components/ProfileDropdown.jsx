import React from "react"

const ProfileDropdown = () => {
  return (
    <div className="flex justify-end ml-2">
      <div className="dropdown relative inline-block background-gold3 font-bold rounded-xl">
        <span>
          <i className="text-[22px] far fa-user-circle p-[10px] text-white"></i>
        </span>
        <div className="dropdown-content hidden absolute background-gold3 z-10 text-white min-w-[135px] rounded-lg left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col">
            <div className="border-b-2 border-white background-gold3 cursor-pointer flex items-center p-2 rounded">
              <a href="/marketplace/mynfts" className="text-white flex items-center">
                <i className="text-[20px] fas fa-fish p-1"></i>
                <span className="pl-1 text-[14px]">My NFTs</span>
              </a>
            </div>
            <div className="border-b-2 background-gold3 cursor-pointer flex items-center p-2 rounded">
              <a href="/marketplace/mylistings" className="text-white flex items-center">
                <i className="text-[20px] fa fa-tag p-1"></i>
                <span className="pl-1 text-[14px]">My Listings</span>
              </a>
            </div>
            <div className="background-gold3 cursor-pointer flex items-center p-2 rounded">
              <a href="/marketplace/claimtokens" className="text-white flex items-center">
                <i className="text-[20px] fas fa-coins p-1"></i>
                <span className="pl-1 text-[14px]">Claim tokens</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDropdown
