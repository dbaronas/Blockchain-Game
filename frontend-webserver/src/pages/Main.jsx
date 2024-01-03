import {
  Hero,
  Stats,
  PatchNotes,
  NFTs,
  AboutGame,
  Testimonials,
  MarketplaceBar,
} from "../components";
import styles from "../style";


const Main = () => (
    <div>
    <div className={`bg-black ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`bg-black ${styles.paddingX} ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <AboutGame />
        <NFTs />
        <MarketplaceBar />
        <PatchNotes />
        <Testimonials />
      </div>
    </div>
  </div>
  );


export default Main;
