import styles from "../style";
import { award, robot } from "../assets";
import PlayNow from "./PlayNow";

const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <img src={award} alt="award" className="w-[32px] h-[32px]" />
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">#1 NFT Game in Lithuania</span>
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-vt323 font-semibold ss:text-[92px] text-[72px] text-gold-gradient ss:leading-[100.8px] leading-[75px]">
            The Next <br className="sm:block hidden" />{" "}
            <span className="text-gold-gradient">Generation</span>{" "}
          </h1>
          <div className="ss:flex hidden md:mr-4 mr-0">
            <PlayNow />
          </div>
        </div>

        <h1 className="font-vt323 font-semibold ss:text-[88px] text-[72px] text-gold-gradient ss:leading-[100.8px] leading-[75px] w-full">
          NFT Game.
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5 text-white`}>
          Our team of experts used advanced blockchain technology
          to create this insanely fun, addicting and secure NFT game.
          This 2D experience will not only bring back nostalgia but will make you some cash aswell!
        </p>
      </div>

      <div className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}>
        <img src={robot} alt="billing" className="w-[100%] h-[100%] relative z-[5]" />

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