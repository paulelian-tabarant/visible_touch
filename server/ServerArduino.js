var SerialPort = require('serialport'); // include the serialport library
var http = require('http');

//var myPort = new SerialPort("/dev/ttyACM0", {
var myPort = new SerialPort("COM4", {
  baudRate: 9600,
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
var delay = 250;

function openPort() {
  ready = true;
  console.log('port open');
  //console.log('baud rate: ' + myPort.options.baudRate);

  myPort.on('data', function (data) {
    console.log(data.toString());
    shouldWrite = false;
  });

  writeInterval = setInterval(writeData, 2000);
}

function writeData() {
  console.log("---------");
  if (shouldWrite) {
    myPort.write("-1 ");
    for (var i = 0; i < dataToWrite.length; i++) {
      myPort.write(dataToWrite[i].toString());
      myPort.write(" ");
    }
    myPort.write("-2 ");
    myPort.write(dataToWrite.length.toString() + " ");
    myPort.write(delay.toString() + " ");
  }
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