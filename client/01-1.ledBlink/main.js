var socket = io.connect('localhost:4200');

window.onload = function(){
  socket = io.connect();
}

function LedOn(){
	console.log("LedOn");
  socket.emit('ledStatus', true);
}

function LedOff(){
	console.log("LedOff");
  socket.emit('ledStatus', false);
}