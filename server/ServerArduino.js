var SerialPort = require('serialport'); // include the serialport library
var http = require('http');

var myPort;

function connectArduino() {
  SerialPort.list(function(err, ports) {
    var allports = ports.length;
    var count = 0;
    var done = false
    ports.forEach(function(port) {
      count += 1;
      pm = port['manufacturer'];
      if (typeof pm !== 'undefined' && 
          (pm.includes('arduino') || pm.includes('Arduino'))) {
        console.log(port.comName.toString());
        myPort = new SerialPort(port.comName.toString(), {
          baudRate: 115200,
          dataBits: 8,
          parity: 'none',
          stopBits: 1,
          flowControl: false
        }); // open the port
        myPort.on('open', openPort); // called when the serial port opens
        return port.comName.toString();
      }
      if (count === allports && done === false) {
         console.log('cant find arduino')
      }
    });
  });
}

connectArduino();
var ready = false;
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

  writeInterval = setInterval(queryArduino, 1000);
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
  var stringToSend = pWidth.toString()+",";
  stringToSend += pHeight.toString() + ",";
  stringToSend += delays.length.toString() + ",";
  for(var i = 0; i < delays.length; i++){
    stringToSend += delays[i].toString() + ",";
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
      delays = obj.delays;
      pWidth = obj.width;
      pHeight = obj.height;
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