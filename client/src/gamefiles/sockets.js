// import io from 'socket.io-client';

// const socket = io();

// // Event Listeners 
// const move = {
//   up: false,
//   down: false,
//   left: false,
//   right: false
// }

// function keyEvent(e, boolean) {
//   switch (e.keyCode) {
//     case 87: // W
//       move.up = boolean;
//       break;
//     case 83: // S
//       move.down = boolean;
//       break;
//     case 65: // A
//       move.left = boolean;
//       break;
//     case 68: // D
//       move.right = boolean;
//       break;
//   }
// }

// document.addEventListener('keydown', (e) => keyEvent(e, true))

// document.addEventListener('keyup', (e) => keyEvent(e, false))


// // Client Actions
// socket.emit('new player');
// setInterval(function () {
//   socket.emit('move', move);
// }, 1000 / 60);