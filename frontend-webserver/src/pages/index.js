import { lazy } from "react";
const Main = lazy(() => import('./Main'))
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))
import { createGlobalState } from "react-hooks-global-state"

const { getGlobalState, useGlobalState, setGlobalState } = createGlobalState({
    connectedAccount: ''
})

export {
    Main,
    Game,
    News,
    getGlobalState,
    useGlobalState,
    setGlobalState
}