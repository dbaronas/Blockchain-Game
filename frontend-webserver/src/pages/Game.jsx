import React, { useEffect, useRef } from "react"
import { getGameInstance } from "../game/game"
import styles from "../style"
import { isMobile } from "react-device-detect"

const Game = () => {
  if (isMobile) {
    return <div className={`flex-1 ${styles.flexCenter} h-[70vh]`}>
      <p className={`${styles.paragraph} max-w-[300px] text-white text-center`}>
        This game is not available on mobile devices yet.
      </p>
    </div>
  } else {
    const gameRef = useRef(null)

    useEffect(() => {
      getGameInstance()
    }, [])
    return <div className={`${styles.flexCenter}`} id="fisherman" ref={gameRef}></div>
  }
}

export default Game
