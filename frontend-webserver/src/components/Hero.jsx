import styles from "../style";
import { award, robot } from "../assets";
import PlayNow from "./PlayNow";
import { useTranslation } from "react-i18next"

const Hero = () => {

  const { t } = useTranslation('Hero')

  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={award} alt="award" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">{t("Tag")}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-vt323 font-semibold ss:text-[92px] text-[72px] text-gold-gradient ss:leading-[100.8px] leading-[75px]">
            {t("Title1")} <br className="sm:block hidden" />{" "}
            <span className="text-gold-gradient">{t("Title2")}</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            <PlayNow />
          </div>
        </div>

        <h1 className="font-vt323 font-semibold ss:text-[88px] text-[72px] text-gold-gradient ss:leading-[100.8px] leading-[75px] w-full">
          {t("Title3")}
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 text-white`}>
          {t("Paragraph")}
        </p>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={robot} alt="billing" className="w-[100%] h-[100%] relative z-[5]" loading="lazy"/>

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

      <div className={`ss:hidden ${styles.flexCenter}`}>
        <PlayNow />
      </div>
    </section>
  );
};

export default Hero;