'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SerialPort = require('serialport').SerialPort;
var debug = require('debug')('create2:driver');

var RoombaOptions = {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
};

var Roomba = function () {
  function Roomba(port) {
    var _this = this;

    _classCallCheck(this, Roomba);

    this.inputBuffer = null;
    this.port = new SerialPort(port, RoombaOptions);
    this.commands = [function () {
      _this.drive(-255, -255);
    }, function () {
      _this.drive(255, 255);
    }, function () {
      _this.drive(-80, 80);
    }, function () {
      _this.drive(80, -80);
    }, function () {
      _this.port.write(Buffer.from([7]));
    }, function () {
      _this.port.write(Buffer.from([132]));
    }, function () {
      _this.port.write(Buffer.from([131]));
    }, function () {
      _this.port.write(Buffer.from([128]));
    }, function () {
      _this.port.write(Buffer.from([139, 0, 125, 255]));
    }, function () {
      _this.port.write(Buffer.from([139, 0, 0, 0]));
    }, function () {
      _this.port.write(Buffer.from([140, 3, 1, 64, 16, 141, 3]));
    }, function () {
      _this.close();
    }, function () {
      _this.drive(0, 0);
    }];

    this.port.on('open', function () {
      debug('connected');
      _this.init();
    });

    this.port.on('data', function (data) {
      if (!_this.inputBuffer) {
        _this.inputBuffer = data;
      } else {
        _this.inputBuffer = Buffer.concat([_this.inputBuffer, data]);
      }

      debug(_this.inputBuffer.length + ' Bytes received');
      debug(_this.inputBuffer.toJSON().data.toString());

      if (_this.inputBuffer.length == 80) {
        debug('===== Clear');
        _this.inputBuffer = null;
      }
    });
  }

  _createClass(Roomba, [{
    key: 'init',
    value: function init() {
      this.port.write(Buffer.from([128]));
      this.port.write(Buffer.from([131]));
      this.port.write(Buffer.from([7]));
    }
  }, {
    key: 'close',
    value: function close() {
      debug('close');
      this.port.close();
      process.exit(0);
    }
  }, {
    key: 'drive',
    value: function drive(right, left) {
      var buf = new Buffer(5);
      buf[0] = 145;
      buf.writeInt16BE(right, 1);
      buf.writeInt16BE(left, 3);
      this.port.write(buf);
      debug(buf.toJSON().data.toString());
    }
  }, {
    key: 'handler',
    value: function handler(socket) {
      var _this2 = this;

      socket.on('message', function (data) {
        debug(data);
        if (_this2.port.isOpen) {
          _this2.commands[data.id]();
        } else {
          console.error('port is not open');
        }
      });
    }
  }]);

  return Roomba;
}();

module.exports = Roomba;