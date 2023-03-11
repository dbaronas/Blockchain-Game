import BeginningScene from "./BeginningScene.js"
import TutorialScene from "./TutorialScene.js"

const config = {
    type: Phaser.AUTO,
    parent: 'fisherman',
    width: 1280,
	  height: 720,
    scene: [
      TutorialScene,
      BeginningScene
    ],
    scale: {
      zoom: 1,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: true,
        gravity: {y: 0}
      }
    }
  }
  new Phaser.Game(config)