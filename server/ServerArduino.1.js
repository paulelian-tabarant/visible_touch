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

function openPort() {
    ready = true;
    console.log('port open');
    //console.log('baud rate: ' + myPort.options.baudRate);
        
    myPort.on('data', function(data) {
        console.log(data.toString());   
        shouldWrite = false;
    });

    setTimeout(startWriting, 5000);
    writeInterval = setInterval(writeData,1000);
}


var RGBYCMData = [];
function setDataRGBYCM(){
    for(var i=0; i<30; i++){
        if(i%3==0){
            RGBYCMData[i] = 255;
        }else{
            RGBYCMData[i] = 0;
        }
    }
    
    for(var i=30; i<60; i++){
        if(i%3==1){
            RGBYCMData[i] = 255;
        }else{
            RGBYCMData[i] = 0;
        }
    }
    
    for(var i=60; i<90; i++){
        if(i%3==2){
            RGBYCMData[i] = 255;
        }else{
            RGBYCMData[i] = 0;
        }
    }
    
    for(var i=90; i<120; i++){
        if(i%3==2){
            RGBYCMData[i] = 0;
        }else{
            RGBYCMData[i] = 255;
        }
    }
    
    for(var i=120; i<150; i++){
        if(i%3==0){
            RGBYCMData[i] = 0;
        }else{
            RGBYCMData[i] = 255;
        }
    }
    
    for(var i=150; i<180; i++){
        if(i%3==1){
            RGBYCMData[i] = 0;
        }else{
            RGBYCMData[i] = 255;
        }
    }
}

setDataRGBYCM();


function writeData(){
    console.log("---------");
    if(shouldWrite){
        myPort.write("-1 ");
        for(var i=0; i<180; i++){
            myPort.write(RGBYCMData[i].toString());
            myPort.write(" ");
        }
        myPort.write("-2 ");
        myPort.write("180 ");
    }
}

function startWriting(){
    shouldWrite = true;
}

function sendDataToArduino(data){

}