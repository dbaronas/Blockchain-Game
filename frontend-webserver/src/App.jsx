import styles from "./style";
import { Navbar, Footer } from "./components";
import { Main, Game } from "./pages";
import { BrowserRouter, Routes, Route } from "react-router-dom";


const App = () => (
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
      </Routes>
      <div className={`bg-black ${styles.paddingX} ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Footer />
      </div>
      </div>
    </BrowserRouter>
  </div>
);

export default App;