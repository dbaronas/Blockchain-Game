import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./NewsButton";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Monthly updates <br className="sm:block hidden" />
      </h2>
      <p className={`${styles.paragraph} max-w-[29.4rem] mt-5`}>
        Read latest news about MetaOcean
      </p>
      <Button styles="mt-10" />
    </div>
    <div className={layout.sectionImg}>
      <img src={card} alt="card" className="w-[100%] h-[100%]"/>
    </div>
  </section>
)

export default CardDeal;
