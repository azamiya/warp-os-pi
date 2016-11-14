"use strict";
// const PORT = 4422;

var PORT = 4200;
var path = require('path');

//to control iRobot create2
var fs = require("fs");
var Repl = require("repl");
var Devices = require("./src/detect");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Roomba = require("./src/roombaController.js");

Devices.getArduinoComName().then(function (port) {
  board = new five.Board({
    "repl": false,
    port: port
  });
  board.on("ready", boardHandler);
  board.on("fail", function (event) {
    console.error(event);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.use("/", express.static(path.join(__dirname, 'client')));
app.use("/assets", express.static(path.join(__dirname, 'client/assets')));
http.listen(PORT, function () {
  console.log('Listen on ', PORT);
});

var pixel = require("node-pixel");
var five = require("johnny-five");

var strip = null;
var numPixels = 12;

var fps = 30; // how many frames per second do you want to try?

//Connect to PSVR
var yaw = 90;
var servo_yaw = 90;

function boardHandler() {
  servo_yaw = new five.Servo({
    pin: 6,
    range: [30, 150],
    startAt: 90
  });

  console.log("Board ready, lets add light");

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [{ pin: 3, length: 12 }, { pin: 7, length: 8 }]
  });

  strip.on("ready", function () {

    console.log("Strip ready");

    var colors = ["red", "green", "blue"];
    var current_colors = [0, 1, 2];
    var pixel_list = [0, 1, 2];
    var blinker = setInterval(function () {
      strip.color("#000"); // blanks it out
      for (var i = 0; i < pixel_list.length; i++) {
        if (++pixel_list[i] >= strip.stripLength()) {
          pixel_list[i] = 0;
          if (++current_colors[i] >= colors.length) current_colors[i] = 0;
        }
        strip.pixel(pixel_list[i]).color(colors[current_colors[i]]);
      }

      strip.show();
    }, 1000 / fps);
  });

  strip.on("error", function (err) {
    console.log(err);
    process.exit();
  });
};

Devices.getRoombaComName().then(function (port) {
  var roomba = new Roomba(port);
  io.of('/irobotCommand').on('connection', roomba.handler.bind(roomba));
});

io.sockets.on('connection', function (socket) {
  console.log("hello socket");
  socket.on('servo', function (deg) {
    if (deg[0] !== null && deg[0] !== undefined) servo_yaw.to(180 - deg[0]);
  });
});