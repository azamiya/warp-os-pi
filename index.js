"use strict";
const PORT = 4200;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static(__dirname + '/client'));

http.listen(PORT, function(){
  console.log('Listen on ',PORT);
});

const five = require('johnny-five');
let board = new five.Board({"repl":false});
let led = null;

board.on("ready", function() {
  console.log("hello board");
  led = new five.Led(13);
  led.on();
});

io.sockets.on('connection', function(socket) {
  console.log("hello socket");
  socket.on('ledStatus', function(status) {
    if (status) {
      console.log("Led on!!!");
      led.on();
    } else {
      console.log("Led off...");
      led.stop().off();
    }
  });
});
