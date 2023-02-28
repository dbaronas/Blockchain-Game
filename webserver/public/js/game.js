import BeginningScene from "./BeginningScene.js"
import TutorialScene from "./TutorialScene.js"

const config = {
    type: Phaser.AUTO,
    parent: 'fisherman',
    width: 800,
	  height: 608,
    scene: [BeginningScene],
    scale: {
      zoom: 1,
    },
    physics: {
      default: 'arcade',
      matter: {
        debug: true,
        gravity: {y: 0}
      }
    }
  }
  new Phaser.Game(config)
