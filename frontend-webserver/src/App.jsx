import { Suspense } from "react";
import styles from "./style";
import { Navbar, Footer, RouteGuard } from "./components";
import { Main, Game, News } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactLoading from 'react-loading';
import Authentication from "./pages/Authentication";


const App = () => {

  /*const [walletConnected, setWalletConnected] = useState(null)

  const setWalletExistsValue = (value) => {
    setWalletConnected(value)
    console.log(walletConnected + 'lol')
  }*/

  let wallet = Authentication()
  let walletConnected = wallet.props.children[0].props.children[0].props.children.props.currentAddress

  return(
  <Suspense fallback={
    <div className="bg-black flex-1 h-screen">
      <ReactLoading type="bars" style={{
        fill: 'white',
        height: '50%',
        width: '50%',
        margin: 'auto',
        transform: 'scale(0.2)'
      }}/>
  </div>
  }>
  <div className="bg-black w-full overflow-hidden">
    <BrowserRouter>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Main />}/>
        <Route path="/game" element={
            <RouteGuard walletConnected={walletConnected}>
            <Game />
            </RouteGuard>
        } />
        <Route path="/news" element={<News />}/>
        <Route path="/marketplace" element={
          <RouteGuard walletConnected={walletConnected}>
            <div className={`${styles.flexCenter} h-[50vh]`}>
              <p className={`${styles.flex} max-w-[300px] text-white text-center`}>
                Market coming soon!
              </p>
            </div>
          </RouteGuard>
        }/>
        <Route path="/mint" element={
          <RouteGuard walletConnected={walletConnected}>
            <div className={`${styles.flexCenter} h-[50vh]`}>
              <p className={`${styles.flex} max-w-[300px] text-white text-center`}>
                NFT minting coming soon!
              </p>
            </div>
          </RouteGuard>
        }/>
      </Routes>
      <div className={`bg-black ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
      </div>
      </div>
    </BrowserRouter>
  </div>
  </Suspense>
  )
};

export default App;