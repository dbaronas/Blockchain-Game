import React, { useState, useEffect } from "react"

const RegisterPopup = ({ onSubmit, currentAddress }) => {
  
  const [modal, setModal] = useState(true)
  const [error, setError] = useState(null)

  const toggleModal = () => {
    setModal(!modal)
  }

  useEffect(() => {
    if (modal) {
      document.body.style.overflowY = "hidden"
    } else {
      document.body.style.overflowY = "unset"
    }
  }, [modal])

  const checkIfUsernameExists = async (username) => {
    const type = "username"
    const data = {type: type, data: username}
    try {
      const response = await $.ajax({
        type: 'POST',
        url: 'http://193.219.91.103:6172/api/v1/db/checkUser',
        data: JSON.stringify(data),
        contentType: 'application/json',
      })
      return response.exists
    } catch (error) {
      console.log(error)
    }
  }

  const handleForm = async (event) => {
    event.preventDefault()
    const username = document.getElementById("username").value
    const data = { 
      island: 'TutorialScene',
      inventory: {
        coins: 0,
        items: {0: {name: 'fr_1', quantity: 1, type: 'fishing-rod'}}
      },
    }
    const doesUsernameExists = await checkIfUsernameExists(username)
    if (doesUsernameExists === true) {
      let errorMessage = `Username '${username}' is not available`
      setError(errorMessage)
    }
    else {
      onSubmit(currentAddress, username, data)
      toggleModal()
    }
  }

  return (
    <>
      {modal && (
        <div className="modal w-screen h-screen inset-0 fixed z-[6]">
          <div className="overlay w-screen h-screen inset-0 absolute bg-gray-700 bg-opacity-80"
          ></div>
          <div className="modal-content absolute left-2/4 top-[40%] transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded w-[24rem] h-[22rem]">
            <div className="flex justify-center flex-col items-center gap-[2rem] mt-3">
              <h2 className="font-semibold text-[2.3rem]">Register</h2>
              <form onSubmit={handleForm} className="flex flex-col min-w-[19.5rem]">
                <label className="text-[1.3rem] mb-2 font-medium">Username</label>
                <input
                  type="text"
                  id="username"
                  className="text-black block border-black border-2 bg-white min-h-[2.5rem] mb-[1.5rem] w-[19.5rem]"
                  placeholder="Enter your username"
                  required
                />
                <button className="rounded-sm border-solid border-black border-2 bg-white min-h-[2rem] text-[1.2rem] mb-[1rem] w-[19.5rem]">
                  Register
                </button>
                {error !== null && (
                  <div className="text-black flex justify-center text-[1.1rem] font-normal flex-wrap min-h-[3.5rem] w-[19.5rem]">{error}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RegisterPopup
