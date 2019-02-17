import Phaser from 'phaser';

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

// Game Objects
let platforms;
let ground;

function preload() {
  // Preload game assets
  this.load.image('background', 'client/src/assets/Background/png/1920x1080/Background/Background.png');
  this.load.image('ground', 'client/src/assets/Tiles/png/128x128/GrassCliffMid.png');
}

function create() {
  // Add background png
  this.add.image(540, 360, 'background');
  // Create platforms on map
  platforms = this.physics.add.staticGroup();
  platforms.create(600, 400, 'ground').setScale(0.5);
  // Create floor of the map
  ground = this.add.tileSprite(540, 688, 1080, 64, "ground");
  ground.tileScaleX = 0.5;
  ground.tileScaleY = 0.5;
}

function update() {}