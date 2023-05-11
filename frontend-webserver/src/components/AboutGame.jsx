import { features } from "../constants";
import styles, { layout } from "../style";
import Button from "./ExploreButton";
import { useTranslation } from "react-i18next"

const FeatureCard = ({ icon, title, content, index }) => {
  return (
    <div
      className={`flex flex-row p-6 rounded-[1.1rem] ${
        index !== features.length - 1 ? "mb-6" : "mb-0"
      } feature-card`}
    >
      <div
        className={`w-[4rem] h-[4rem] rounded-full ${styles.flexCenter} bg-dimBlue`}
      >
        <img src={icon} alt="icon" className="w-[50%] h-[50%] object-contain" />
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className="font-poppins font-semibold text-white text-[1.1rem] leading-[1.3rem] mb-1">
          {title}
        </h4>
        <p className="font-poppins font-normal text-dimWhite text-[1rem] leading-[1.35rem] mb-1">
          {content}
        </p>
      </div>
    </div>
  )
}

const Business = () => {

  const { t } = useTranslation('Business')

  return (
    <section id="features" className={layout.section}>
      <div className={layout.sectionInfo}>
        <h2 className={styles.heading2}>
          {t("Paragraph1")}
        </h2>
        <p className={`${styles.paragraph} max-w-[35rem] mt-5 flex margin`}>
          {t("Paragraph2")}
        </p>

        <Button styles="mt-10" />
      </div>

      <div className={"${layout.sectionImg} flex-col"}>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            icon={feature.icon}
            title={t(feature.id + '-title')}
            content={t(feature.id + '-content')}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default Business;
