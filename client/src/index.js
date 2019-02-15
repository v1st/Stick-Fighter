import io from 'socket.io-client';

const socket = io();
// **** Canvas functionality ********************
import Game from './gamefiles/Game.js';

function init() {
  const ctx = document.getElementById('canvas').getContext('2d');
  ctx.canvas.width = 1080;
  ctx.canvas.height = 720;

  // Create new HTML canvas game enviorment
  const game = new Game(socket, ctx);
  
  // Updates and draws content
  game.run();
}

init();
