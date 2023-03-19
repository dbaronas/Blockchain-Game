import styles from '../style'

const ShopButton = () => (
    <div className={`${styles.flexCenter} w-[140px] h-[50px] rounded-[10%] bg-red-gradient p-[2px] cursor-pointer`}>
      <div className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-[10%]`}>
        <div className={`${styles.flexStart} flex-row`}>
          <p className='font-vt323 font-medium text-[30px] leading-[15px]'>
            <span className='text-red-gradient'>Shop Now!</span>
          </p>
        </div>
      </div>
    </div>
  )

export default ShopButton