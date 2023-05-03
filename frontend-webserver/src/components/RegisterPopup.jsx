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
        items: {}
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
          <div className="modal-content absolute left-2/4 top-[40%] transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-8 rounded max-w-600 min-w-300">
            <div className="flex justify-center flex-col items-center gap-2 mt-3">
              <h2>Register</h2>
              <form onSubmit={handleForm} className="gap-2 flex flex-col">
                <label>Enter username:</label>
                <input
                  type="text"
                  id="username"
                  className="text-black block border-black border-2"
                  placeholder="arthur"
                  required
                />
                <button className="border-solid border-black border-2">
                  Submit
                </button>
                {error !== null && (
                  <div className="text-black text-sm flex justify-center">{error}</div>
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
