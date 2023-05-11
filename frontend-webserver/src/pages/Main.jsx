import {
  Hero,
  Stats,
  PatchNotes,
  NFTs,
  AboutGame,
  Testimonials,
  Clients,
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
        <Clients />
      </div>
    </div>
  </div>
  );


export default Main;
