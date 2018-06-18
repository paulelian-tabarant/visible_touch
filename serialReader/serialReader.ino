#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    100
#define BRIGHTNESS  128
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
int nextLed = 0;
int currFrame = 0;
int dataLength = 0;
int numLeds = 10;
int numFrames = 10;
int delayFrames[100];
unsigned long time_now = 0;
CRGB leds[NUM_LEDS];
CRGB ledData[2000];
bool ended = false;
bool started = false;
int counter;
int currInt;
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
        if(millis() > time_now + delayFrames[currFrame]){
            time_now = millis();
            currFrame = (currFrame + 1) % numFrames;
            for(int i=0; i<numLeds; i++){
                leds[i] = ledData[nextLed];
                nextLed = (nextLed + 1) % dataLength;
            }
            FastLED.show();
        }
    }
    
    if(ended){
        inString = inString;
        Serial.print(inString);
        inString = "";
        ended = false;
        started = false;
        currFrame = 0;
        nextLed = 0;
    }
}

void serialEvent(){
    while(Serial.available()){
        char inChar = (char)Serial.read();
        if(!started){            
            if(inChar == '<'){
                started = true;
                Serial.print('y');
                currInt = 0;
                counter = 0;
            }
        }else{
            inString += inChar;
            if(inChar == ','){
                if(counter == 0){
                    numLeds = currInt;
                }else if(counter == 1){
                    numFrames = currInt;
                    dataLength = numLeds * numFrames;
                }else if(counter < numFrames + 2){
                    delayFrames[counter - 2] = currInt;
                }else{
                    int i = counter - 2 - numFrames;
                    if(i%3 == 0){
                        ledData[i/3].r = currInt;
                    }else if(i%3 == 1){
                        ledData[i/3].g = currInt;
                    }else{
                        ledData[i/3].b = currInt;
                    }
                }
                counter++;
                currInt = 0;
            }else if(inChar == '>'){
                ledData[dataLength].b = currInt;
                ended = true;
            }else{
                currInt = currInt*10 + inChar - '0';
            }
        }        
    }
}

