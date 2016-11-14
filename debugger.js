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
let servo_yaw = 90;

board.on("ready", function() {
  console.log("hello board");
  led = new five.Led(13);
  led.on();
  servo_yaw = new five.Servo({
    pin : 3,
    range: [30, 150],
    startAt: 90
  });
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
  socket.on('servo', function(vol) {
    servo_yaw.to(vol);
  });
});
