import styles from "../style"
import { useTranslation } from "react-i18next"

const PlayNow = () => {

  const { t } = useTranslation('Hero')

  return(
    <div className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-gold-gradient p-[4px] cursor-pointer`}>
      <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}>
        <div className={`${styles.flexStart} flex-row`}>
          <p className="font-vt323 font-medium text-[40px] leading-[24px] mb-1 text-center">
            <a href="/game">
              <span className="text-gold hover:text-secondary leading-8">
                {t("Play")}<br/>{t("Now")}
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlayNow;