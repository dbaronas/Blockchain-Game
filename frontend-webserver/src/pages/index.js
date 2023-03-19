import { lazy } from "react";
const Main = lazy(() => import('./Main'))
const Game = lazy(() => import('./Game'))

export {
    Main,
    Game
}