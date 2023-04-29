import { lazy } from "react";
import Main from './Main'
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))
const Login = lazy(() => import('./Login'))
import { createGlobalState } from "react-hooks-global-state"

const { getGlobalState, useGlobalState, setGlobalState } = createGlobalState({
    connectedAccount: ''
})

export {
    Main,
    Game,
    News,
    Login,
    getGlobalState,
    useGlobalState,
    setGlobalState
}