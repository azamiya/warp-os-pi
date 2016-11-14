"use strict";
var PORT = 4200;
var path = require('path');

//to control iRobot create2
var fs = require("fs");
var Repl = require("repl");
var five = require('johnny-five');
var Devices = require("../src/detect");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Roomba = require("../src/roombaController.js");

var board = null;
var led = null;
var yaw = 90;
var servo_yaw = null;

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use("/", express.static(path.join(__dirname, '../client')));
app.use("/assets", express.static(path.join(__dirname, '../client/assets')));
http.listen(PORT, function () {
  console.log('Listen on ', PORT);
});

function boardHandler() {
  console.log("Board ready, lets add light");
  servo_yaw = new five.Servo({
    pin : 6,
    range: [30, 150],
    startAt: 90
  });
  led = new five.Led(11);
  led.on();
};

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

Devices.getArduinoComName().then(function (port) {
  console.log("hello arduino board");
  board = new five.Board({
    "repl": false,
    port: port
  });
  board.on("ready", boardHandler);
  board.on("fail", function (event) {
    console.error(event);
  });
});


Devices.getRoombaComName().then(function (port) {
  var roomba = new Roomba(port);
  io.of('/irobotCommand').on('connection', roomba.handler.bind(roomba));
});