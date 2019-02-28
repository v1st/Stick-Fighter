import Phaser from 'phaser';
import io from 'socket.io-client';

// Phaser config settings
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  pixelArt: true,
  physics: {
    default: 'impact',
    impact: {
      debug: true,
      gravity: 1600,
      setBounds: true
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

export const game = new Phaser.Game(config);

function preload() {
  // Preload game assets
  this.load.image('background', 'client/src/assets/Background/Background.png');
  // Load Tile map csv and image
  this.load.tilemapCSV('tileSheet', 'client/src/assets/Tiles/dino.csv');
  this.load.image('tiles', 'client/src/assets/Tiles/TileMap.png');
  // Load Player sprite
  this.load.spritesheet('blueDino', 'client/src/assets/Character/png/DinoSpritesBlue.png', {
    frameWidth: 24,
    frameHeight: 24
  });
  this.load.spritesheet('redDino', 'client/src/assets/Character/png/DinoSpritesRed.png', {
    frameWidth: 24,
    frameHeight: 24
  });
  this.load.spritesheet('greenDino', 'client/src/assets/Character/png/DinoSpritesGreen.png', {
    frameWidth: 24,
    frameHeight: 24
  });
  this.load.spritesheet('yellowDino', 'client/src/assets/Character/png/DinoSpritesYellow.png', {
    frameWidth: 24,
    frameHeight: 24
  });
}

function create() {
  // Add background png
  this.add.image(540, 360, 'background');
  // Add tilemap and tileset
  const config = {
    key: 'tileSheet', // csv file
    tileWidth: 32,
    tileHeight: 32
  }
  // Add tilemap
  this.map = this.make.tilemap(config);
  // Add tile image
  this.tileset = this.map.addTilesetImage('tiles');
  // Combine tilemap and image
  this.layer = this.map.createStaticLayer(0, this.tileset, 0, 0);
  this.layer.setCollisionBetween(0, 8);

  // Add map collision
  this.slopeMap = {
    0: 2,
    1: 1,
    2: 24,
    3: 1,
    4: 0,
    5: 1,
    6: 1,
    7: 1,
    8: 1
  };

  this.impact.world.setCollisionMapFromTilemapLayer(this.layer, {
    slopeMap: this.slopeMap
  });

  // Load player animations
  preloadAnimation(this, 'blue', 'blueDino');
  preloadAnimation(this, 'red', 'redDino');
  preloadAnimation(this, 'green', 'greenDino');
  preloadAnimation(this, 'yellow', 'yellowDino');

  // ************* Socket testing *********************
  this.socket = io();
  this.enemies = [];
  // Pull current players connected to server
  this.socket.on('currentPlayers', (players) => {
    console.log(players)
    Object.keys(players).forEach((id) => {
      if (players[id].playerId === this.socket.id) {
        addPlayer(this, players[id]);
      } else {
        addOtherPlayers(this, players[id], 'redDino');
      }
    });
  });

  // Retrieve data from players that join the game
  this.socket.on('newPlayerJoined', (playerInfo) => {
    addOtherPlayers(this, playerInfo, 'greenDino');
  });

  // Retrieve packet data from player movement
  this.socket.on('updatedPackets', (playerInfo) => {
    this.enemies.forEach((enemy) => {
      if (playerInfo.playerId === enemy.playerId) {
        enemy.body.reset(playerInfo.x, playerInfo.y);
        let {
          left,
          right,
          kick,
          crouch
        } = playerInfo.keyCodes;
        console.log(playerInfo.keyCodes)
        if (left.isDown) {
          enemy.flipX = true;
          enemy.anims.play('red left', true);
        } else if (right.isDown) {
          enemy.flipX = false;
          enemy.anims.play('red right', true);
        } else if (kick.isDown) {
          enemy.anims.play('red kick', true);
        } else if (crouch.isDown) {
          enemy.anims.play('red crouch', true);
        } else {
          enemy.anims.play('red idle', true);
        }
      }
    })
  })

  // Remove a players data on disconnection
  this.socket.on('disconnect', (playerId) => {
    this.enemies.forEach((enemy) => {
      if (playerId === enemy.playerId) {
        enemy.destroy();
      }
    });
  });

  // ************* Socket testing *********************

  // Add keyboard listener
  this.cursors = this.input.keyboard.createCursorKeys();
  this.kick = this.input.keyboard.addKey('Z'); // Kick key
  this.crouch = this.input.keyboard.addKey('C'); // Crouch key
  //hit = this.input.keyboard.addKey('X'); // Damaged 
}

function update() {
  // Player movement
  if (this.player) {
    let accel = this.player.body.standing ? this.player.body.accelGround : this.player.body.accelAir;

    if (this.cursors.up.isDown && this.player.body.standing) {
      this.player.setVelocityY(-800);
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-accel);
      this.player.flipX = true;
      this.player.anims.play('blue left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(accel);
      this.player.flipX = false;
      this.player.anims.play('blue right', true);
    } else if (this.kick.isDown) {
      this.player.anims.play('blue kick', false)
    } else if (this.crouch.isDown) {
      this.player.anims.play('blue crouch', true)
    } else {
      this.player.setAccelerationX(0);
      this.player.anims.play('blue idle', true);
    }
    // Emit player movement to server
    let x = this.player.x;
    let y = this.player.y;
    this.socket.emit('playerPacket', {
      x,
      y,
      keyCodes: {
        ...this.cursors,
        kick: this.kick,
        crouch: this.crouch
      }
    })
  }

  this.enemies.forEach((enemy) => {

  });
}

// Game functions
function addPlayer(self, playerInfo) {
  // Create Player model
  self.player = self.impact.add.sprite(playerInfo.x, playerInfo.y, 'blueDino');
  self.player.body.accelGround = 300;
  self.player.body.accelAir = 300;
  self.player.body.jumpSpeed = 1000;
  self.player.setMaxVelocity(300, 300);
  self.player.setFriction(1600, 500);
  self.player.setBodyScale(2, 2);
  self.player.setOffset(8, 6, 32, 32);
  self.player.setActiveCollision();
}

function addOtherPlayers(self, playerInfo, spriteSheet) {
  const otherPlayer = self.impact.add.sprite(playerInfo.x, playerInfo.y, spriteSheet);
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.body.accelGround = 300;
  otherPlayer.body.accelAir = 300;
  otherPlayer.body.jumpSpeed = 1000;
  otherPlayer.setMaxVelocity(300, 300);
  otherPlayer.setFriction(1600, 500);
  otherPlayer.setBodyScale(2, 2);
  otherPlayer.setOffset(8, 6, 32, 32);
  otherPlayer.setActiveCollision();

  self.enemies.push(otherPlayer);
}

function preloadAnimation(self, color, spriteSheet) {
  // Player animations
  self.anims.create({
    key: `${color} left`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 4,
      end: 9,
    }),
    frameRate: 5,
    repeat: -1,
  });

  self.anims.create({
    key: `${color} idle`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 0,
      end: 3
    }),
    frameRate: 5
  });

  self.anims.create({
    key: `${color} right`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 4,
      end: 9
    }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: `${color} kick`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 11,
      end: 12
    }),
    frameRate: 5,
    repeat: 2
  });

  self.anims.create({
    key: `${color} crouch`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 17,
      end: 22
    }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: `${color} damaged`,
    frames: self.anims.generateFrameNumbers(spriteSheet, {
      start: 12,
      end: 15
    }),
    frameRate: 5,
    repeat: -1
  });
}