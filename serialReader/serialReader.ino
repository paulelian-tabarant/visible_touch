#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    10
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];
CRGB ledData[500];
int nextLed;
int counter;
int dataLength;

void setup() {
    delay( 3000 ); // power-up safety delay
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
    FastLED.setBrightness(  BRIGHTNESS );
    
    Serial.begin(9600);
    while(!Serial){
      //wait for connection
      ;
    }
    
    counter=0;
}


void loop()
{
    for(int i=0; i<NUM_LEDS; i++){
        leds[i] = ledData[nextLed];
        nextLed = (nextLed+1)%dataLength;
    }
    FastLED.show();
    delay(250);
}

void serialEvent(){
    counter = 0;
    while(Serial.available()){
        if(counter%3==0){
            ledData[counter/3].r = Serial.read();
        }else if(counter%3==1){
            ledData[counter/3].g = Serial.read();          
        }else{
            ledData[counter/3].b = Serial.read();          
        }
        counter++;
    }
    dataLength = counter/3;
    nextLed = 0;
    Serial.write("Data received");
}

