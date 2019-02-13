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
const c = document.getElementById('canvas').getContext('2d');

window.addEventListener('resize', resize);

function resize() {
  canvas.width = 1080;
  canvas.height = 720;
}

// ********** need to update players on connect
let players = {}

function init() {

}

function loop() {
// ********** do i stream data?

  c.clearRect(0, 0, canvas.width, canvas.height);
  

//  socket.on('state', (players) => {
    for (let id in players) {
      let player = players[id];
      c.beginPath();
      c.arc(player.x, player.y, 10, 0, Math.PI * 2);
      c.fillStyle = "red";
      c.fill();
      c.closePath();
    }
 // });
  socket.on()

  window.requestAnimationFrame(loop);
}

resize();
init();
loop();