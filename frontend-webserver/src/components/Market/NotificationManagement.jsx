import { createGlobalState } from "react-hooks-global-state"

const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState({
  alert: { show: false, msg: "", color: "" },
  loading: { show: false, msg: "" },
})

const setAlert = (msg, color = "green") => {
  setGlobalState("loading", false)
  setGlobalState("alert", { show: true, msg, color })
  setTimeout(() => {
    setGlobalState("alert", { show: false, msg: "", color })
  }, 2000)
}

const setLoadingMsg = (msg) => {
  setGlobalState("loading", { show: true, msg })
}

export {
  useGlobalState,
  setGlobalState,
  getGlobalState,
  setAlert,
  setLoadingMsg,
}
