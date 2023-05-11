import { lazy } from "react";
import Navbar from "./Navbar";
const NFTs = lazy(() => import("./NFTs"))
const PatchNotes = lazy(() => import("./PatchNotes"))
const AboutGame = lazy(() => import("./AboutGame"))
const Clients = lazy(() => import("./Clients"))
const MarketplaceBar = lazy(() => import("./MarketplaceBar"))
const Stats = lazy(() => import("./Stats"))
const Testimonials = lazy(() => import("./Testimonials"))
import RouteGuard from './RouteGuard'
import Footer from "./Footer";
import Hero from "./Hero";

export {
  Navbar,
  NFTs,
  PatchNotes,
  AboutGame,
  Clients,
  MarketplaceBar,
  Stats,
  Footer,
  Testimonials,
  Hero,
  RouteGuard
};