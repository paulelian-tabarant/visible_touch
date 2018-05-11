var SerialPort = require('serialport'); // include the serialport library

function sendLedData(ledData){

    var myPort = new SerialPort("COM4", {baudRate: 9600});// open the port
    myPort.on('open', openPort); // called when the serial port opens
    
    function openPort() {
        var brightness = 0; // the brightness to send for the LED
        console.log('port open');
        //console.log('baud rate: ' + myPort.options.baudRate);
    
        // since you only send data when the port is open, this function
        // is local to the openPort() function:
        function sendData() {
            myPort.write(ledData);
        }
        
        myPort.on('data', function(data) {
            console.log("data sent!");
            myPort.close();
            clearInterval(sendInterval);
        });

        // set an interval to update the brightness 2 times per second:
        var sendInterval = setInterval(sendData,5000);
    }
}

var randData = [];

setRandomLedData();

function setRandomLedData(){
    for(var i=0;i<30;i++){
        randData[i] = Math.floor(Math.random()*256);
    }
}
sendLedData(randData);