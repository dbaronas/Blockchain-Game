import { bill } from "../assets";
import styles, { layout } from "../style";
import { useTranslation } from "react-i18next"

const Billing = () => {

  const { t } = useTranslation('Billing')

  return (
    <section id="product" className={layout.sectionReverse}>
      <div className={layout.sectionImgReverse}>
        <img
          src={bill}
          alt="billing"
          className="w-[100%] h-[100%] relative z-[5]"
        />
      </div>
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] -left-1/2 bottom-0 w-[50%] h-[50%] rounded-full red__gradient" />

      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          {t("Title1")} <br className="sm:block hidden" /> {t("Title2")}
        </h2>
        <p className={`${styles.paragraph} max-w[470px] mt-5`}>
          {t("Paragraph")}
        </p>
      </div>
    </section>
  );
};

export default Billing;
