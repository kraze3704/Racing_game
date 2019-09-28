
// keyboard keyCode values save to constants
const KEY_UP_ARROW = 38, KEY_DOWN_ARROW = 40, KEY_LEFT_ARROW = 37, KEY_RIGHT_ARROW = 39;
const KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;

// keyboard hold state variables
let keyHeld_Gas = false, keyHeld_Reverse = false, keyHeld_turnLeft = false, keyHeld_turnRight = false;


_setKeyHoldState = (key, setTo) => {

    if(key == KEY_UP_ARROW || key == KEY_W) {
        keyHeld_Gas = setTo;
    } else if(key == KEY_DOWN_ARROW || key == KEY_S) {
        keyHeld_Reverse = setTo;
    }

    if(key == KEY_LEFT_ARROW || key == KEY_A) {
        keyHeld_turnLeft = setTo;
    } else if(key == KEY_RIGHT_ARROW || key == KEY_D) {
        keyHeld_turnRight = setTo;
    }

}

_inputInit = () => {

    document.addEventListener("keydown", keyPressed = (evt) => {

        _setKeyHoldState(evt.keyCode, true);

        if(evt.keyCode == 116 || evt.keyCode == 123) {  // excluded f5(116) f12(123) key for refreshing / console window
            return;
        }

        evt.preventDefault(); // block keys from serving their default functionality

    });
    
    document.addEventListener("keyup", keyReleased = (evt) => {
        _setKeyHoldState(evt.keyCode, false);
    });
    
}
