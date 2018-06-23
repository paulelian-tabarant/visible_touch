#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    100
#define LEDS_WIDTH 10
#define LEDS_HEIGHT 6
#define BRIGHTNESS  32
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
int pWidth = 0;
int pHeight = 0;
int minWidth = 0;
int minHeight = 0;
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
    pWidth = 0;
    pHeight = 0;
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
            for(int i=0; i<minHeight; i++){
                if(i%2==0){
                    for(int j = 0; j < minWidth; j++){
                        leds[i*LEDS_WIDTH + j] = ledData[nextLed];
                        nextLed = (nextLed + 1) % dataLength;
                    }
                    for(int j = minWidth; j < LEDS_WIDTH; j++){
                        leds[i*LEDS_WIDTH + j] = CRGB::Black;
                    }
                    for(int j = LEDS_WIDTH; j < pWidth; j++){
                        nextLed = (nextLed + 1) % dataLength;
                    }
                }else{
                    for(int j = pWidth; j > LEDS_WIDTH; j--){
                        nextLed = (nextLed + 1) % dataLength;
                    }
                    for(int j = 0; j < LEDS_WIDTH - minWidth; j++){
                        leds[i*LEDS_WIDTH + j] = CRGB::Black;
                    }
                    for(int j = LEDS_WIDTH - minWidth; j < LEDS_WIDTH; j++){
                        leds[i*LEDS_WIDTH + j] = ledData[nextLed];
                        nextLed = (nextLed + 1) % dataLength;
                    }
                }
                /*for(int j=0; j<minWidth; j++){
                    leds[i*LEDS_WIDTH + j] = ledData[nextLed];
                    nextLed = (nextLed + 1) % dataLength;
                }
                for(int j=minWidth; j<LEDS_WIDTH; j++){
                    leds[i*LEDS_WIDTH + j] = CRGB::Black;
                }
                for(int j = LEDS_WIDTH; j<pWidth; j++){
                    nextLed = (nextLed + 1) % dataLength;
                }*/
            }
            for(int i = minHeight; i<LEDS_HEIGHT; i++){
                for(int j=0; j<LEDS_WIDTH; j++){
                    leds[i*LEDS_WIDTH + j] = CRGB::Black;
                }
            }
            for(int i = LEDS_HEIGHT; i<pHeight; i++){
                for(int j = 0; j < pWidth; j++){
                    nextLed = (nextLed + 1) % dataLength;                    
                }
            }


            // for(int i=0; i<numLeds; i++){
            //     leds[i] = ledData[nextLed];
            //     nextLed = (nextLed + 1) % dataLength;
            // }
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
                    pWidth = currInt;
                    minWidth = min(pWidth,LEDS_WIDTH);
                }else if(counter == 1){
                    pHeight = currInt;
                    minHeight = min(pHeight,LEDS_HEIGHT);
                    numLeds = pHeight * pWidth;
                }else if(counter == 2){
                    numFrames = currInt;
                    dataLength = numLeds * numFrames;
                }else if(counter < numFrames + 3){
                    delayFrames[counter - 3] = currInt;
                }else{
                    int i = counter - 3 - numFrames;
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

