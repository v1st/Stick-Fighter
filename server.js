const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

app.set('port', port);

// GET static client side files
app.use('/client', express.static(__dirname + '/client'));

// Routing
app.get('/', function(req, res){
  // Serve html
  res.sendFile(__dirname + '/client/dist/index.html');
});

io.on('connection', (socket) => {
  console.log('new user connected')
  socket.on('message', (msg) => {
    console.log('Message Received: ', msg);
    socket.emit('message', msg);
  });
  setInterval(function() {
    io.sockets.emit('message', 'hi!');
  }, 1000);
});


// Start server
server.listen(port, () => console.log(`Test app listening on port ${port}!`))