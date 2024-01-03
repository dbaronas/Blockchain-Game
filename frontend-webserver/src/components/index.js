import { lazy } from "react";
import Navbar from "./Navbar";
const NFTs = lazy(() => import("./NFTs"))
const PatchNotes = lazy(() => import("./PatchNotes"))
const AboutGame = lazy(() => import("./AboutGame"))
const MarketplaceBar = lazy(() => import("./MarketplaceBar"))
const Stats = lazy(() => import("./Stats"))
const Testimonials = lazy(() => import("./Testimonials"))
const MyTokenDetails = lazy(() => import("./Market/MyTokenDetails"))
const MyListingDetails = lazy(() => import("./Market/MyListingDetails"))
const MarketListingDetails = lazy(() => import("./Market/MarketListingDetails"))
import RouteGuard from './RouteGuard'
import Footer from "./Footer";
import Hero from "./Hero";

export {
  Navbar,
  NFTs,
  PatchNotes,
  AboutGame,
  MarketplaceBar,
  Stats,
  Footer,
  Testimonials,
  Hero,
  RouteGuard,
  MyTokenDetails,
  MyListingDetails,
  MarketListingDetails
};