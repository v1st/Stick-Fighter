import io from 'socket.io-client';
 
const socket = io();

socket.on('message', function (data) {
  console.log(data);
});