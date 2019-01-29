const Phaser = require('phaser');

export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 200}
    }
  },
  scene: {
    preload,
    create
  }
} 