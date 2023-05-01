import { useTranslation } from "react-i18next"

const NewsButton = ({ styles }) => {

  const { t } = useTranslation('CardDeal')

  return (
    <button
      type="button"
      className={`py-4 px-6 bg-gold-gradient font-poppins font-medium text-[1.1rem] text-primary outline-none ${styles} rounded-[0.7rem]`}
      href={'/news'}
    >
      {t("PatchNotes")}
    </button>
  );
};

export default NewsButton;
