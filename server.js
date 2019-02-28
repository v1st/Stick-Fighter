const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;
var FRAME_RATE = 1000.0 / 0.5;

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
  players[socket.id] = {
    playerId: socket.id,
    x: 550,
    y: 300,
    keyCodes: undefined,
  }

  // Send current list of players to the new client
  socket.emit('currentPlayers', players);

  // Send new player to connected clients
  socket.broadcast.emit('newPlayerJoined', players[socket.id]);

  // Update server with player packets
  socket.on('playerPacket', (packet) => {
    players[socket.id].x = packet.x;
    players[socket.id].y = packet.y;
    players[socket.id].keyCodes = packet.keyCodes;
    socket.broadcast.emit('updatedPackets', players[socket.id])
  })

  // Disconnected player
  socket.on('disconnect', () => {
    // Remove disconnected player
    console.log('user disconnect');
    delete players[socket.id];
  });
});

setInterval(() => {
  // Send player packets to every client, 60 times a second
  io.sockets.emit('allPackets', players);
}, FRAME_RATE);

// Start server
server.listen(port, () => console.log(`Test app listening on port ${port}!`))