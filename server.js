const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;
var FRAME_RATE = 1000.0 / 60.0;

app.set('port', port);

// GET static client side files
app.use('/client', express.static(__dirname + '/client'));

// Routing
app.get('/', function (req, res) {
  // Serve html to user
  res.sendFile(__dirname + '/client/dist/index.html');
});

// WebSocket Connection and interaction
// Store connected users
let players = {};

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.on('new player', () => {
    players[socket.id] = {
      x: 550,
      y: 300
    }
  });

  // socket.on('move', (data) => {
  //   let player = players[socket.id] || {};
  //   switch (true) {
  //     case data.up: // W
  //       player.y -= 5;
  //       break;
  //     case data.down: // S
  //       player.y += 5;
  //       break;
  //     case data.left: // A
  //       player.x -= 5;
  //       break;
  //     case data.right: // D
  //       player.x += 5;
  //       break;
  //   }
  // })

  // Disconnected player
  socket.on('disconnect', () => {
    // Remove disconnected player
    console.log('user disconnect');
    delete players[socket.id];
  });
});

setInterval(() => {
  // needs to update game and players state
  io.sockets.emit('state', players);
}, FRAME_RATE);

// Start server
server.listen(port, () => console.log(`Test app listening on port ${port}!`))