import styles from "../style";

const PlayNow = () => (
  <div className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer`}>
    <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}>
      <div className={`${styles.flexStart} flex-row`}>
        <p className="font-vt323 font-medium text-[40px] leading-[24px] mb-1">
          <span className="text-gradient">Play</span>
        </p>
      </div>
      
      <p className="font-vt323 font-medium text-[40px] leading-[24px]">
        <span className="text-gradient">Now</span>
      </p>
    </div>
  </div>
);

export default PlayNow;