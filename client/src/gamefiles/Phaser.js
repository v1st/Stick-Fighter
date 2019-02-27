import Phaser from 'phaser';
import io from 'socket.io-client';
import Client from './Client';

//const client = new Client(socket);

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

let map;
let tileset;
let layer;
let player;
let cursors;
let kick;
let crouch;
let connectedPlayers = {};

function preload() {
  // Preload game assets
  this.load.image('background', 'client/src/assets/Background/Background.png');
  // Load Tile map csv and image
  this.load.tilemapCSV('tileSheet', 'client/src/assets/Tiles/Dino.csv');
  this.load.image('tiles', 'client/src/assets/Tiles/TileMap.png');
  // Load Player sprite
  this.load.spritesheet('dino', 'client/src/assets/Character/png/DinoSpritesBlue.png', {
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
  map = this.make.tilemap(config);
  // Add tile image
  tileset = map.addTilesetImage('tiles');
  // Combine tilemap and image
  layer = map.createStaticLayer(0, tileset, 0, 0);
  layer.setCollisionBetween(0, 8);

  // Add collision
  const slopeMap = {
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
  this.impact.world.setCollisionMapFromTilemapLayer(layer, {
    slopeMap
  });

  // Add keyboard listener
  cursors = this.input.keyboard.createCursorKeys();
  kick = this.input.keyboard.addKey('Z'); // Kick key
  crouch = this.input.keyboard.addKey('C'); // Crouch key
  //hit = this.input.keyboard.addKey('X'); // Damaged 

  
  // ************* Socket testing *********************
  this.socket = io();
  console.log(this)
  this.otherPlayers = this.add.group();

  // Pull current players connected to server
  this.socket.on('currentPlayers', (players) => {
    console.log(players)
    Object.keys(players).forEach((id) => {
      if (players[id].playerId === this.socket.id) {
        addPlayer(this, players[id]);
      }
    });
  });

  // Retrieve data from players that join the game
  this.socket.on('newPlayerJoined', (playerInfo) => {
    addOtherPlayers(this, playerInfo);
  });

  // Remove a players data on disconnection
  this.socket.on('disconnect', (playerId) => {
    this.otherPlayers.getChildren().forEach((otherPlayer) => {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
}

function update() {
  // let accel = player.body.standing ? player.body.accelGround : player.body.accelAir;
  // // Player movement
  // if (cursors.up.isDown && player.body.standing) {
  //   player.setVelocityY(-800);
  // } else if (cursors.left.isDown) {
  //   player.setVelocityX(-accel);

  //   player.flipX = true;
  //   player.anims.play('left', true);
  // } else if (cursors.right.isDown) {
  //   player.setVelocityX(accel);

  //   player.flipX = false;
  //   player.anims.play('right', true);

  // } else if (kick.isDown) {
  //   player.anims.play('kick', false)
  // } else if (crouch.isDown) {
  //   player.anims.play('crouch', true)
  // } else {
  //   player.setAccelerationX(0);
  //   player.anims.play('idle', true);
  // }
}

// Game functions
function addPlayer(self, playerInfo) {
  // Create Player model
  self.player = self.impact.add.sprite(playerInfo.x, playerInfo.y, 'dino');
  self.player.body.accelGround = 300;
  self.player.body.accelAir = 300;
  self.player.body.jumpSpeed = 1000;
  self.player.setMaxVelocity(300, 300);
  self.player.setFriction(1600, 500);
  self.player.setBodyScale(2, 2);
  self.player.setOffset(8, 6, 32, 32);
  self.player.setActiveCollision();

  // Player animations
  self.anims.create({
    key: 'left',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 4,
      end: 9,
    }),
    frameRate: 5,
    repeat: -1,
  });

  self.anims.create({
    key: 'idle',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 0,
      end: 3
    }),
    frameRate: 5
  });

  self.anims.create({
    key: 'right',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 4,
      end: 9
    }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: 'kick',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 11,
      end: 12
    }),
    frameRate: 5,
    repeat: 2
  });

  self.anims.create({
    key: 'crouch',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 17,
      end: 22
    }),
    frameRate: 5,
    repeat: -1
  });

  self.anims.create({
    key: 'damaged',
    frames: self.anims.generateFrameNumbers('dino', {
      start: 12,
      end: 15
    }),
    frameRate: 5,
    repeat: -1
  });
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.impact.add.sprite(playerInfo.x, playerInfo.y, 'dino');
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.setBodyScale(2, 2);
  otherPlayer.setOffset(8, 6, 32, 32);
  otherPlayer.setActiveCollision();
  
  self.otherPlayers.add(otherPlayer);
}