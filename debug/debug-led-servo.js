"use strict";
var PORT = 4200;
var path = require('path');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use("/", express.static(path.join(__dirname, '../client')));
app.use("/assets", express.static(path.join(__dirname, '../client/assets')));
http.listen(PORT, function () {
  console.log('Listen on ', PORT);
});

const five = require('johnny-five');
let board = new five.Board({"repl":false});
let led = null;
let yaw = 90;
let servo_yaw = 90;


board.on("ready", function() {
  console.log("hello board");
  servo_yaw = new five.Servo({
    pin : 6,
    range: [30, 150],
    startAt: 90
  });
  led = new five.Led(11);
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
  socket.on('servo', function(vol) {
    servo_yaw.to(vol);
  });
});