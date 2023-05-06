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
          <div className="modal-content absolute left-2/4 top-[40%] transform -translate-x-1/2 -translate-y-1/2 text-gold2 font-vt323 p-5 rounded w-[24rem] h-[22rem] bg-[url('../src/assets/oceantheme.jpg')]">
            <div className="flex justify-center flex-col items-center gap-[1.6rem] mt-2">
              <h2 className="font-semibold text-[2.6rem]">Register</h2>
              <form onSubmit={handleForm} className="flex flex-col min-w-[19.5rem]">
                <label className="text-[1.6rem] font-medium">Username</label>
                <input
                  type="text"
                  id="username"
                  className="block border-2 bg-white min-h-[2.5rem] mb-[1.5rem] w-[19.5rem] text-[1.2rem]"
                  placeholder="Enter your username"
                  required
                />
                <button className="rounded-sm border-solid border-2 bg-white min-h-[2rem] text-[1.2rem] mb-[1rem] w-[19.5rem] hover:text-secondary">
                  Register
                </button>
                {error !== null && (
                  <div className="flex justify-center text-[1.1rem] font-normal flex-wrap min-h-[3.5rem] w-[19.5rem] text-yellow-200">{error}</div>
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
