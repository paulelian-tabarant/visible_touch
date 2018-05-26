var SerialPort = require('serialport'); // include the serialport library

var myPort = new SerialPort("COM4", 
    {baudRate: 9600,
    dataBits: 8, 
    parity: 'none', 
    stopBits: 1, 
    flowControl: false});// open the port
myPort.on('open', openPort); // called when the serial port opens
var ready = false;
console.log("blabla");

var shouldWrite = false;
var dataToWrite;

function openPort() {
    ready = true;
    console.log('port open');
    //console.log('baud rate: ' + myPort.options.baudRate);
        
    myPort.on('data', function(data) {
        console.log(data.toString());   
        shouldWrite = false;
    });

    writeInterval = setInterval(writeData,1000);
}

setDataRGBYCM();


function writeData(){
    console.log("---------");
    if(shouldWrite){
        myPort.write("-1 ");
        for(var i=0; i<180; i++){
            myPort.write(dataToWrite[i].toString());
            myPort.write(" ");
        }
        myPort.write("-2 ");
        myPort.write(dataToWrite.length.toString()+" ");
    }
}

function startWriting(){
    shouldWrite = true;
}

function sendDataToArduino(data){
    dataToWrite = data;
    startWriting();
}