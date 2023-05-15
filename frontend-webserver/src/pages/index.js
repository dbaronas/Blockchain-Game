import { lazy } from "react";
import Main from './Main'
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))
const Login = lazy(() => import('./Login'))


export {
    Main,
    Game,
    News,
    Login,
}