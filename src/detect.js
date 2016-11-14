'use strict';

var SerialPort = require('serialport');
var arduinoVID = '0x2a03';
var arduinoPID = '0x0043';
var roombaVID = '0x0403';
var roombaPID = '0x6015';

function detectComNameById(vendorId, productId) {
  return new Promise(function (resolve, reject) {
    SerialPort.list(function (err, devices) {
      if (err) {
        reject(err);
      }

      for (var key in devices) {
        var device = devices[key];
        if (device.vendorId === vendorId && device.productId === productId) {
          resolve(device.comName);
        }
      }
      reject('specified device not found');
    });
  });
}

/*
 *  Example
 *
detectComNameById(arduinoVID, arduinoPID)
  .then( dev => {
    console.log("arduino: ", dev);
  })
  .catch( err => {
    console.error(err);
  });
detectComNameById(roombaVID, roombaPID)
  .then( dev => {
    console.log("roomba: ", dev);
  })
  .catch( err => {
    console.error(err);
  });
*/

function getArduinoComName() {
  return detectComNameById(arduinoVID, arduinoPID);
}

function getRoombaComName() {
  return detectComNameById(roombaVID, roombaPID);
}

module.exports = {
  getArduinoComName: getArduinoComName,
  getRoombaComName: getRoombaComName,
  detectComNameById: detectComNameById
};