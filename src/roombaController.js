const SerialPort = require('serialport').SerialPort;
const debug = require('debug')('create2:driver');

const RoombaOptions = {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none', 
  stopBits: 1,
  flowControl: false
};

class Roomba {

  constructor(port) {
    
    this.inputBuffer = null;
    this.port = new SerialPort(port, RoombaOptions);
    this.commands = [
      () => { this.drive(-255, -255); },
      () => { this.drive(255, 255); },
      () => { this.drive(-80, 80); },
      () => { this.drive(80, -80); },
      () => { this.port.write(Buffer.from([7])); },
      () => { this.port.write(Buffer.from([132])); },
      () => { this.port.write(Buffer.from([131])); },
      () => { this.port.write(Buffer.from([128])); },
      () => { this.port.write(Buffer.from([139, 0, 125, 255])); },
      () => { this.port.write(Buffer.from([139, 0, 0, 0])); },
      () => { this.port.write(Buffer.from([140, 3, 1, 64, 16, 141, 3])); },
      () => { this.close(); },
      () => { this.drive(0,0); }
    ];

    this.port.on('open', () => {
      debug('connected');
      this.init();
    });

    this.port.on('data', data => {
      if (!this.inputBuffer) {
        this.inputBuffer = data;
      } else {
        this.inputBuffer = Buffer.concat([this.inputBuffer, data]);
      }

      debug(`${this.inputBuffer.length} Bytes received`);
      debug(this.inputBuffer.toJSON().data.toString());

      if (this.inputBuffer.length == 80) {
        debug('===== Clear');
        this.inputBuffer = null;
      }
    });

  }

  init() {
    this.port.write(Buffer.from([128]));
    this.port.write(Buffer.from([131]));
    this.port.write(Buffer.from([7]));
  }

  close () {
    debug('close');
    this.port.close();
    process.exit(0);
  }


  drive (right, left) {
    const buf = new Buffer(5);
    buf[0] = 145;
    buf.writeInt16BE(right, 1);
    buf.writeInt16BE(left, 3);
    this.port.write(buf);
    debug(buf.toJSON().data.toString());
  }

  handler(socket) {
    socket.on('message', data => {
      debug(data);
      if (this.port.isOpen) {
        this.commands[data.id]();
      } else {
        console.error('port is not open');
      }
    });
  }
}

module.exports = Roomba;
