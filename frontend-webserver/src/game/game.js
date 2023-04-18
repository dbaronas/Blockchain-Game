import Phaser from "phaser"
import BeginningScene from "./BeginningScene.js"
import BeginningScene2 from "./BeginningScene2.js"
import CatchModal from "./CatchModal.js"
import InventoryScene from "./InventoryScene.js"
import TutorialScene from "./TutorialScene.js"
import ShopScene from "./ShopScene.js"
import ChatScene from "./ChatScene.js"
import MainMenu from "./MainMenu.js"


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
        MainMenu,
        //TutorialScene,
        BeginningScene,
        BeginningScene2,
        CatchModal,
        InventoryScene,
        ShopScene,
        ChatScene
      ],
      dom: {
        createContainer: true
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {y: 0},
        }
      }
    };
    game = new Phaser.Game(config)
  }
  return game
}
