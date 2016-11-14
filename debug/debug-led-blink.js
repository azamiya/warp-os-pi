"use strict";
var PORT = 4200;
var path = require('path');

//to control iRobot create2
var fs = require("fs");
var Repl = require("repl");
var Devices = require("../src/detect");

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

/*Devices.getArduinoComName().then(function (port) {
  board = new five.Board({
    "repl": false,
    port: port
  });
  board.on("ready", boardHandler);
  board.on("fail", function (event) {
    console.error(event);
  });
});*/
const five = require('johnny-five');
var board = null;

Devices.getArduinoComName().then(function (port) {
  console.log("hello arduino board");
  console.log("port01 is : " + port);
  board = new five.Board({
    "repl": false,
    port: port
  });
  console.log("port is : " + port);
  board.on("ready", boardHandler());
  board.on("fail", function (event) {
    console.error(event);
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.use("/", express.static(path.join(__dirname, '../client')));
app.use("/assets", express.static(path.join(__dirname, '../client/assets')));
http.listen(PORT, function () {
  console.log('Listen on ', PORT);
});

let led = null;

function boardHandler() {
  console.log("Board ready, lets add light");
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
});
