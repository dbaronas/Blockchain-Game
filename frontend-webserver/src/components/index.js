import { lazy } from "react";
import Navbar from "./Navbar";
const Billing = lazy(() => import("./Billing"))
const CardDeal = lazy(() => import("./CardDeal"))
const Business = lazy(() => import("./Business"))
const Clients = lazy(() => import("./Clients"))
const CTA = lazy(() => import("./CTA"))
const Stats = lazy(() => import("./Stats"))
const Testimonials = lazy(() => import("./Testimonials"))
import RouteGuard from './RouteGuard'
import Footer from "./Footer";
import Hero from "./Hero";

export {
  Navbar,
  Billing,
  CardDeal,
  Business,
  Clients,
  CTA,
  Stats,
  Footer,
  Testimonials,
  Hero,
  RouteGuard
};