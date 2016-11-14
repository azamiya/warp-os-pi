'use strict';
const SerialPort = require('serialport');
const arduinoVID = '0x2a03';
const arduinoPID = '0x0043';
const roombaVID = '0x0403';
const roombaPID = '0x6015';

function detectComNameById(vendorId, productId) {
  return new Promise((resolve, reject) => {
    SerialPort.list((err, devices) => {
      if (err) {
        reject(err);
      }

      for (let key in devices) {
        let device = devices[key];
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
  getArduinoComName,
  getRoombaComName,
  detectComNameById
};
