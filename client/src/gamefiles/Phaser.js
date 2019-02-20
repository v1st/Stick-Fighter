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

let map;
let tileset;
let layer;
let player;
let gravity = 300;
let cursors;

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
  layer = map.createStaticLayer(0, tileset,0 ,0);
  layer.setCollisionBetween(0, 8);

  // Create Player model
  player = this.physics.add.sprite(100, 450, 'dino');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(gravity)

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
  this.physics.add.collider(player, layer);

  // Add keyboard listener
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
    player.flipX= true;
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
    player.flipX= false;
  } else {
    player.setVelocityX(0);

    player.anims.play('idle', true);
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}