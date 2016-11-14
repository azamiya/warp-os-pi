"use strict";
// const PORT = 4422;

var PORT = 4200;
var path = require('path');

//to control iRobot create2
var fs = require("fs");
var Repl = require("repl");
var Devices = require("../src/detect");

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Roomba = require("../src/roombaController.js");

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.use("/", express.static(path.join(__dirname, 'client')));
app.use("/assets", express.static(path.join(__dirname, 'client/assets')));
http.listen(PORT, function () {
  console.log('Listen on ', PORT);
});


Devices.getRoombaComName().then(function (port) {
  var roomba = new Roomba(port);
  io.of('/irobotCommand').on('connection', roomba.handler.bind(roomba));
});