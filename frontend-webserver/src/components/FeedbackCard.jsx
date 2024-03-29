import { quotes } from "../assets";
import { socialMedia } from "../constants";

const FeedbackCard = ({ content, name, title, img, link }) => {
  const socialImg = socialMedia.find((social, index) => index === 3)?.icon;

  return (
    <div className="flex justify-between flex-col px-10 py-12 rounded-[20px] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 feedback-card">
      <img
        src={quotes}
        alt="double_quotes"
        className="w-[42px] h-[27px] object-contain"
      />
      <p className="font-vt323 font-normal text-[18px] leading-[32px] text-white my-10">
        {content}
      </p>
      <div className="flex flex-row items-center">
        <img src={img} alt={name} className="w-[60px] h-[60px] rounded-full" />
        <div className="flex flex-col ml-4">
          <h4 className="font-vt323 font-semibold text-[20px] leading-[32px] text-white">
            {name}
          </h4>
          <p className="font-vt323 font-normal text-[16px] leading-[24px] text-dimWhite">
            {title}
          </p>
        </div>
        <div>
          <a href={link}>
            <img
              src={socialImg}
              alt="social media"
              className="w-[1.4rem] h-[1.4rem] object-contain cursor-pointer ml-6 grayscale hover:brightness-50 transition duration-300 ease-in-out"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
