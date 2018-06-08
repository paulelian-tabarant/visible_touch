#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    10
#define BRIGHTNESS  128
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
int nextLed = 0;
int counter = 0;
int dataLength = 0;
int delayFrame = 500;
bool started = false;
bool ended = false;

CRGB leds[NUM_LEDS];
CRGB ledData[500];

void setup() {
    delay( 3000 ); // power-up safety delay
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    
    Serial.begin(9600);
    while(!Serial){
      //wait for connection
      ;
    }
}


void loop()
{
    for(int i=0; i<NUM_LEDS; i++){
        leds[i] = ledData[nextLed];
        nextLed = (nextLed + 1) % dataLength;
    }
    FastLED.show();
    delay(delayFrame);
}

void serialEvent(){
    counter = 0;
    started = false;
    ended = false;
    int antiLoopCounter = 0;
    while(!ended){
        if(Serial.available()){
            antiLoopCounter = 0;
            if(started){
                int val = Serial.parseInt();
                if(val == -2){
                    ended = true;
                    //Serial.print("E");
                }else if(val == -1){
                    counter = 0;
                }else{
                    if(counter%3==0){
                        ledData[counter/3].r = val;
                    }else if(counter%3==1){
                        ledData[counter/3].g = val;          
                    }else{
                        ledData[counter/3].b = val;
                    }
                    counter = counter + 1;
                    //Serial.print(val);
                }
            }else{
                int val = Serial.parseInt();
                if(val == -1){
                    started = true;
                    //Serial.print("S");
                }
            }
            
        }else{
            delay(50);
            antiLoopCounter = antiLoopCounter + 1;
            if(antiLoopCounter > 10){
                break;
            }
        }
    }
    while(!Serial.available() && antiLoopCounter<10){
        Serial.write("hey");
        antiLoopCounter++;
        delay(50);
    }
    if(Serial.available()){
        int tot = Serial.parseInt();
        delayFrame = Serial.parseInt();
        if(tot == counter){
            Serial.print(counter);
            Serial.print(delayFrame);
            dataLength = counter/3;
            nextLed = 0;
        }
    }
}

