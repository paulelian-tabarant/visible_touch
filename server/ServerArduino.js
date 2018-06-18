var SerialPort = require('serialport'); // include the serialport library
var http = require('http');

// var myPort = new SerialPort("/dev/ttyACM0", {
var myPort = new SerialPort("COM4", {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
}); // open the port
myPort.on('open', openPort); // called when the serial port opens
var ready = false;
console.log("blabla");

var shouldWrite = false;
var dataToWrite;
var delay = [];
var dataReceived = "";

function openPort() {
  ready = true;
  console.log('port open');
  //console.log('baud rate: ' + myPort.options.baudRate);

  myPort.on('data', function (data) {
    var dataString = data.toString();
    dataReceived += dataString;
    if (dataString == "y") {
      writeData();
    }
    shouldWrite = false;
  });

  writeInterval = setInterval(queryArduino, 4000);
}

function queryArduino(){
  console.log(dataReceived);
  dataReceived = "";
  console.log(shouldWrite);
  if (shouldWrite) {
    myPort.write("<");
  }
}

function writeData() {
  //var stringToSend = "<";
  var stringToSend = "60,";
  console.log(delay);
  stringToSend += delay.length.toString() + ",";
  for(var i = 0; i < delay.length; i++){
    stringToSend += delay[i].toString() + ",";
  }
  for (var i = 0; i < dataToWrite.length-1; i++) {
    stringToSend += dataToWrite[i].toString() + ",";
  }
  stringToSend += dataToWrite[dataToWrite.length-1].toString();
  stringToSend += ">";
  console.log(stringToSend);
  stringToSend = stringToSend;
  myPort.write(stringToSend);
}

function startWriting() {
  shouldWrite = true;
}

function sendDataToArduino(data) {
  dataToWrite = data;
  startWriting();
}

var serv = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  res.writeHead(200, {'Content-Type': 'application/json'});
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      obj = JSON.parse(body);
      dataToWrite = obj.data;
      delay = obj.delay;
      numLeds = obj.numLeds;
      startWriting();
      res.write(JSON.stringify(obj));
      checkInterval = setInterval(checkWriting,200);
      function checkWriting(){
        if(!shouldWrite){
          clearInterval(checkInterval);
          res.end("ok");
        }
      }
    });
  }
  else {
    console.log("bli");
    res.end();
  }
}).listen(8000);