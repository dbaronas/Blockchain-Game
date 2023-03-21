import Phaser from "phaser"
import BeginningScene from "./BeginningScene.js"
import CatchModal from "./CatchModal.js"
import InventoryScene from "./InventoryScene.js"
import TutorialScene from "./TutorialScene.js"


let game = null

export const getGameInstance = () => {
  if (!game) {
    const config = {
      type: Phaser.AUTO,
      parent: 'fisherman',
      width: 1280,
      height: 720,
      disableContextMenu: true,
      scene: [
        TutorialScene,
        BeginningScene,
        CatchModal,
        InventoryScene
      ],
      scale: {
        zoom: 1,
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {y: 0},
          fps: 60,
          antialias: false
        }
      }
    };
    game = new Phaser.Game(config)
  }
  return game
}
