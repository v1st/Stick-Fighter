// **** Socket IO imports and functionality ***********
import io from 'socket.io-client';

const socket = io();

const move = {
  up: false,
  down: false,
  left: false,
  right: false
}

const FRAME_RATE = 1000 / 60;

function keyEvent(e, boolean) {
  switch (e.keyCode) {
    case 87: // W
      move.up = boolean;
      break;
    case 83: // S
      move.down = boolean;
      break;
    case 65: // A
      move.left = boolean;
      break;
    case 68: // D
      move.right = boolean;
      break;
  }
}

document.addEventListener('keydown', (e) => keyEvent(e, true))
document.addEventListener('keyup', (e) => keyEvent(e, false))

// Client Actions
socket.emit('new player');
setInterval(() => {
  socket.emit('move', move);
}, FRAME_RATE);

// **** Canvas functionality ********************
import Game from './gamefiles/Game.js';

const canvas = document.getElementById('canvas');

function init() {
  // Create new game enviorment
  const game = new Game(socket);
  // Create HTML game canvas
  game.create(socket, canvas);
  // Updates and draws content
  game.run();
}

init();
