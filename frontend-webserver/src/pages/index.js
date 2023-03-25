import { lazy } from "react";
const Main = lazy(() => import('./Main'))
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))

export {
    Main,
    Game,
    News
}