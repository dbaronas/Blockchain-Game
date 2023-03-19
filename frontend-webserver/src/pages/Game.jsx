import React, { useEffect, useRef } from "react"
import { getGameInstance } from "../game/game"
import styles from "../style"

const Game = () => {
  const gameRef = useRef(null)

  useEffect(() => {
    getGameInstance()
  }, [])

  return <div className={`${styles.flexCenter}`} id="fisherman" ref={gameRef}></div>
}

export default Game
