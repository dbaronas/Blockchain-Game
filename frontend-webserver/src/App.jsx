import { Suspense } from "react";
import styles from "./style";
import { Navbar, Footer } from "./components";
import { Main, Game, News } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactLoading from 'react-loading';


const App = () => (
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
        <Route path="/game" element={<Game />} />
        <Route path="/news" element={<News />}/>
      </Routes>
      <div className={`bg-black ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
      </div>
      </div>
    </BrowserRouter>
  </div>
  </Suspense>
);

export default App;