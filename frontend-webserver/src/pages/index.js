import { lazy } from "react";
import Main from './Main'
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))
const Login = lazy(() => import('./Login'))
const Market = lazy(() => import('./Market'))


export {
    Main,
    Game,
    News,
    Login,
    Market,
}