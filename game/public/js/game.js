var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 500,
    height: 500,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    } 
}
  
var game = new Phaser.Game(config)

function preload() {
    this.load.image('player', 'assets/circle.png')
}
  
function create() {
    var self = this
    this.socket = io()
    this.otherPlayers = this.physics.add.group()
    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id])
        } else {
          addOtherPlayers(self, players[id])
        }
      })
    })
    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo)
    })
    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
        }
      })
    })
    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y)
        }
      })
    })
    this.cursors = this.input.keyboard.createCursorKeys()
}
  
function addPlayer(self, playerInfo) {
    self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDisplaySize(50, 50)
    self.ship.setMaxVelocity(100)
}
  
function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDisplaySize(50, 50)
    otherPlayer.playerId = playerInfo.playerId
    self.otherPlayers.add(otherPlayer)
}
  
function update() {
    if (this.ship) {
        const speed = 1.5
        let playerVelocity = new Phaser.Math.Vector2();
        if (this.cursors.left.isDown) {
            playerVelocity.x = -100
        } else if (this.cursors.right.isDown) {
            playerVelocity.x = 100
        } else {
            playerVelocity.x = 0
        }
    
        if (this.cursors.up.isDown) {
            playerVelocity.y = -100
        } else if (this.cursors.down.isDown) {
            playerVelocity.y = 100
        } else {
            playerVelocity.y = 0
        }
        
        //playerVelocity.normalize() //to normalize speed when going diagonally
        
        this.ship.setVelocity(playerVelocity.x, playerVelocity.y)
    
        this.physics.world.wrap(this.ship, 5)
    
        // emit player movement
        var x = this.ship.x
        var y = this.ship.y
        if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y)) {
            this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y })
        }
        // save old position data
        this.ship.oldPosition = {
            x: this.ship.x,
            y: this.ship.y,
        }
    }
}