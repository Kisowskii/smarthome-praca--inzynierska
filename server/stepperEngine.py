import gpiod
import time
import sys
DIR_PIN_NO = 23 
STEP_PIN_NO = 24 
CW = 1     
CCW = 0    
SPR = 400   
CHIP_NAME = 'gpiochip4'  

def setup():
    global DIR_LINE, STEP_LINE
    chip = gpiod.Chip(CHIP_NAME)
    DIR_LINE = chip.get_line(DIR_PIN_NO)
    STEP_LINE = chip.get_line(STEP_PIN_NO)
    
    DIR_LINE.request(consumer="dir_pin", type=gpiod.LINE_REQ_DIR_OUT)
    STEP_LINE.request(consumer="step_pin", type=gpiod.LINE_REQ_DIR_OUT)

def cleanup():
    DIR_LINE.release()
    STEP_LINE.release()

def step_motor(direction):
    setup()
    try:
        step_count = SPR
        delay = 0.0208
        
        for x in range(step_count):
            DIR_LINE.set_value(CW if direction == "true" else CCW)
            STEP_LINE.set_value(1)
            time.sleep(delay)
            STEP_LINE.set_value(0)
            time.sleep(delay)
    finally:
        cleanup()

if __name__ == "__main__":
    direction = sys.argv[1] if len(sys.argv) > 1 else "false"
    step_motor(direction)
