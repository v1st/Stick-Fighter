import Phaser from 'phaser';

// Phaser config settings
const config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 720,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      }
    }
  },
  scene: {
    preload,
    create,
    update
  }
}

export const game = new Phaser.Game(config);

let platforms;
let ground;
let player;

function preload() {
  // Preload game assets
  this.load.image('background', 'client/src/assets/Background/Background.png');
  // Load Tile map csv and image
  this.load.tilemapCSV('tileSheet', 'client/src/assets/Tiles/Dino.csv');
  this.load.image('tiles', 'client/src/assets/Tiles/TileMap.png');
  // Load Player sprite
  this.load.spritesheet('player', 'client/src/assets/Character/png/DinoSpritesBlue.png', {
    frameWidth: 64,
    frameHeight: 64
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
  const map = this.make.tilemap(config);
  const tileset = map.addTilesetImage('tiles');
  const layer = map.createStaticLayer(0, tileset);
  // map.setCollision();
  // map.setBaseTileSize(32, 32);

  // Create Player model
  player = this.physics.add.sprite(100, 450, 'player');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{
      key: 'dude',
      frame: 4
    }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });
}

function update() {}