from flask import Flask
import time
from time import sleep
import aiy.device._led as LED
import aiy.device._fan as FAN
import aiy.device._textlcd as LCD
import aiy.device._buzzer as BUZZER
import os
app = Flask(__name__)

@app.route('/')
def index():
    led_on()
    fan_on()
    lcd_hello()
    #buz_str1()
    music()
    return '0'

#LED
def led_off():
    LED.controlLed(LED.LED_PIN1, LED.OFF)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN2, LED.OFF)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN3, LED.OFF)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN4, LED.OFF)
    time.sleep(0.1)
def led_on():   
    LED.controlLed(LED.LED_PIN1, LED.ON)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN2, LED.ON)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN3, LED.ON)
    time.sleep(0.1)
    LED.controlLed(LED.LED_PIN4, LED.ON)

#FAN
def fan_on() :
    FAN.controlFan(FAN.ON)
def fan_off():
    FAN.controlFan(FAN.OFF)

#LCD
def lcd_hello():
    LCD.displayText(text="Hello")

#BUZZER
def buz_str1():
    BUZZER.playBuzzer1(BUZZER.melodyList1, BUZZER.noteDurations)
def buz_str2():
    BUZZER.playBuzzer2(BUZZER.melodyList2, BUZZER.noteDurations)

def music() :
    os.system("pkill mpg123")
    file = "Die.mp3"
    os.system("mpg123 " + file)


if __name__ == '__main__':
    FAN.initFan(FAN.FAN_PIN1,FAN.FAN_PIN2)
    LED.initLedModule()
    LCD.initTextlcd()
    app.run(debug=True, host ='0.0.0.0')