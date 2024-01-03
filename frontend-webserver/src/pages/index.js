import { lazy } from "react";
import Main from './Main'
const Game = lazy(() => import('./Game'))
const News = lazy(() => import('./News'))
const Login = lazy(() => import('./Login'))
const Market = lazy(() => import('./Market'))
const MyNFTs = lazy(() => import('./MyNFTs'))
const MyListings = lazy(() => import('./MyListings'))
const ClaimTokens = lazy(() => import('./ClaimTokens'))


export {
    Main,
    Game,
    News,
    Login,
    Market,
    MyNFTs,
    MyListings,
    ClaimTokens
}