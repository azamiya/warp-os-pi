var ButtonIdMap = {
  "38": "Forward",
  "40": "Back",
  "37": "Left",
  "39": "Right"
}

var commandList = {
  "Back" : 0,
  "Forward" : 1,
  "Right" : 2,
  "Left" : 3,
  "Reset" : 4,
  "Full" : 5,
  "Safe" : 6,
  "Passive" : 7,
  "Beep" : 10,
  "Close" : 11,
  "Stop" : 12
}

var irobotCommand = io.connect('http://localhost:4200/irobotCommand');
var socket = io.connect('localhost:4222');

function keyPressed(key, pressed) {
  if (key < 37 || 40 < key) {
    return;
  }
  //console.log("Direction: " + ButtonIdMap[key] + ", pressed:" + pressed);
  let elem = document.getElementById(ButtonIdMap[key]);
  if (pressed) {
    irobotCommand.emit("message",{id : commandList[ButtonIdMap[key]]});
    elem.style.backgroundColor = "red";
  } else {
    elem.style.backgroundColor = "yellow";
    Stop();
  }
}

function convertData(data) {
  if(data == "LedOn") {
    socket.emit('ledStatus', true);
  } else if (data == "LedOff") {
    socket.emit('ledStatus', false);
  } else if (typeof data == "string"){
    irobotCommand.emit("message",{id : commandList[data]});
  } else if (typeof data == "object"){
    socket.emit('servo', data);
    //console.log(data);
  } else {
    console.log("unknown command!!");
  }
}

document.addEventListener("keydown", function (e) {
  keyPressed(e.which, true);
});
document.addEventListener("keyup", function (e) {
  keyPressed(e.which, false);
});

function Reset(){
  irobotCommand.emit("message",{id : commandList["Reset"]});
}

function Passive(){
  irobotCommand.emit("message",{id : commandList["Passive"]});
}

function Safe(){
  irobotCommand.emit("message",{id : commandList["Safe"]});
}

function Full(){
  irobotCommand.emit("message",{id : commandList["Full"]});
}

function Beep(){
  irobotCommand.emit("message",{id : commandList["Beep"]});
  socket.emit('ledStatus', false);
}

function Close(){
  irobotCommand.emit("message",{id : commandList["Close"]});
}

function Stop(){
  irobotCommand.emit("message",{id : commandList["Stop"]});
}

function LedOn(){
  socket.emit('ledStatus', true);
}

function LedOff(){
  socket.emit('ledStatus', false);
}
