import React, { useEffect, useRef } from "react";
import { getGameInstance } from "../game/game";

const Game = () => {
  const gameRef = useRef(null);

  useEffect(() => {
    getGameInstance();
  }, []);

  return <div id="fisherman" ref={gameRef}></div>;
};

export default Game;
