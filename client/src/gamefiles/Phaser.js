import Phaser from 'phaser';
import io from 'socket.io-client';
import Client from './Client';

const socket = io();

const client = new Client(socket);

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

  // Create Player model
  player = this.impact.add.sprite(550, 300, 'dino');
  player.setMaxVelocity(300, 300).setFriction(1600, 500);
  player.body.accelGround = 300;
  player.body.accelAir = 300;
  player.body.jumpSpeed = 1000;
  player.setActiveCollision();

  // Player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dino', {
      start: 4,
      end: 9,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('dino', {
      start: 0,
      end: 3
    }),
    frameRate: 10
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dino', {
      start: 4,
      end: 9
    }),
    frameRate: 10,
    repeat: -1
  });

  // 11  12 kick
  // 12 - 15 hit
  // 17 - 22 crouch;

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

  // Add players
  // client.askNewPlayer();
  // console.log(client)

  // Add keyboard listener
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  let accel = player.body.standing ? player.body.accelGround : player.body.accelAir;
  // Player movement
  if (cursors.left.isDown) {
    player.setVelocityX(-accel);

    player.flipX = true;
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(accel);

    player.flipX = false;
    player.anims.play('right', true);
  } else {
    player.setAccelerationX(0);
    player.anims.play('idle', true);
  }
  if (cursors.up.isDown && player.body.standing) {
    player.setVelocityY(-800);
  }
}

// Game functions