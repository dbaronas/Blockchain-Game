import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./NewsButton";
import { useTranslation } from "react-i18next"

const CardDeal = () => {

  const { t } = useTranslation('CardDeal')

  return (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        {t("Title")} <br className="sm:block hidden" />
      </h2>
      <p className={`${styles.paragraph} max-w-[29.4rem] mt-5`}>
        {t("Paragraph")}
      </p>
      <a href="/news">
        <Button styles="mt-10" />
      </a>
    </div>
    <div className={layout.sectionImg}>
      <img src={card} alt="card" className="w-[100%] h-[100%]" />
    </div>
  </section>
  )
}

export default CardDeal;
