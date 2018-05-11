#include <FastLED.h>

#define LED_PIN     5
#define NUM_LEDS    10
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];
int counter;
bool changed;

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
    changed=true;
}


void loop()
{
    if(changed){
      FastLED.show();
      changed=false;
    }
}

void serialEvent(){
    while(Serial.available()){
        if(counter%3==0){
            leds[counter/3].r = Serial.read();
        }else if(counter%3==1){
            leds[counter/3].g = Serial.read();          
        }else{
            leds[counter/3].b = Serial.read();          
        }
        counter = (counter+1)%(NUM_LEDS*3);
        changed = true;
        Serial.write("Data received");
    }
}

