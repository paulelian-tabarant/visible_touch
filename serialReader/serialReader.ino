#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    100
#define BRIGHTNESS  128
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
int nextLed = 0;
int nextFrame = 0;
int dataLength = 0;
int numLeds = 10;
int numFrames = 10;
int delayFrames[100];
CRGB leds[NUM_LEDS];
CRGB ledData[2000];
bool ended = false;
bool started = false;
String inString = "";

void setup() {
    delay( 3000 ); // power-up safety delay
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    
    Serial.begin(115200);
    while(!Serial){
      //wait for connection
      ;
    }
}


void loop()
{
    if(!started){
        for(int i=0; i<numLeds; i++){
            leds[i] = ledData[nextLed];
            nextLed = (nextLed + 1) % dataLength;
        }
        FastLED.show();
        delay(delayFrames[nextFrame]);
        nextFrame = (nextFrame + 1) % numFrames;
    }
    
    if(ended){
        Serial.print(inString);
        inString = "";
        ended = false;
        started = false;
    }
}

void serialEvent(){
    while(Serial.available()){
        char inChar = (char)Serial.read();
        inString += inChar;
        started = true;
        if(inChar == '>'){
            ended = true;
        }
    }
}

