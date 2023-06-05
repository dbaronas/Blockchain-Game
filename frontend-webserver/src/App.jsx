import React from "react";
import { Suspense } from "react";
import styles from "./style";
import { Navbar, Footer, RouteGuard, MyTokenDetails, MyListingDetails, MarketListingDetails } from "./components";
import { Main, Game, News, Login, Market, MyNFTs, MyListings, ClaimTokens } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactLoading from 'react-loading';
import { useAccount } from "wagmi";
import i18n from "./i18n"
import { MarketContextProvider } from "./components/Market/MarketContext";


const App = () => {

  const { isConnected } = useAccount()

  return(
  <MarketContextProvider>
    <Suspense
      fallback={
        <div className="bg-black flex-1 h-screen">
          <ReactLoading
            type="bars"
            style={{
              fill: "white",
              height: "50%",
              width: "50%",
              margin: "auto",
              transform: "scale(0.2)",
            }}
          />
        </div>
      }
    >
      <div className="bg-black w-full overflow-hidden">
        <BrowserRouter>
          <div className={`${styles.paddingX} ${styles.flexCenter}`}>
            <div className={`${styles.boxWidth}`}>
              <Navbar />
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="/game"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <Game />
                </RouteGuard>
              }
            />
            <Route path="/news" element={<News />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/marketplace"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <div className={`${styles.flexCenter}`}>
                    <h2 className={`${styles.heading2} ${styles.flexCenter} text-gold3 mt-4`}>
                       Marketplace
                    </h2>
                  </div>
                  <Market />
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/mynfts"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <div className={`${styles.flexCenter}`}>
                    <h2 className={`${styles.heading2} ${styles.flexCenter} text-gold3 mt-4`}>
                       My NFTs
                    </h2>
                  </div>
                  <MyNFTs />
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/mylistings"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <div className={`${styles.flexCenter}`}>
                    <h2 className={`${styles.heading2} ${styles.flexCenter} text-gold3 mt-4`}>
                       My Listings
                    </h2>
                  </div>
                  <MyListings />
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/claimtokens"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <div className={`${styles.flexCenter}`}>
                    <h2 className={`${styles.heading2} ${styles.flexCenter} text-gold3 mt-4`}>
                       Claim tokens
                    </h2>
                  </div>                    
                  <ClaimTokens/>
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/mynfts/:owner/:id"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <MyTokenDetails />
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/mylistings/:owner/:id"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <MyListingDetails />
                </RouteGuard>
              }
            />
            <Route
              path="/marketplace/listings/:owner/:id"
              element={
                <RouteGuard walletConnected={isConnected}>
                  <MarketListingDetails />
                </RouteGuard>
              }
            />
          </Routes>
          <div className={`bg-black ${styles.paddingX} ${styles.flexStart}`}>
            <div className={`${styles.boxWidth}`}>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </div>
    </Suspense>
  </MarketContextProvider>
  )
};

export default App;