
let CAR_X, CAR_Y, CAR_ANGLE = (-0.5 * Math.PI); // CAR_ANGLE faces north
let CAR_SPEED;
const CAR_DRIVE_POWER = 1, CAR_REVERSE_POWER = 0.8, CAR_TURN_RATE = 0.03, CAR_MIN_TURN_SPEED = 0.5, CAR_SPEED_LIMIT = 14, GROUNDSPEED_DECAY_MULT = 0.94;


_DrawCar = () => {

     _drawBitmapCenteredAtLocationWithRotation(carImg, CAR_X, CAR_Y, CAR_ANGLE);

}

_carReset = () => {

    for(i = 0; i < TRACK_COLS; i++) {

        for(j = 0; j < TRACK_ROWS; j++) {

            let trackTileIndex = _trackTileToIndex(i, j);

            if(TRACK_GRID[trackTileIndex] == TRACK_PLAYER) {
                // place the car where 2 is present
                CAR_X = (i + 0.5) * TRACK_W;
                CAR_Y = (j + 0.5) * TRACK_H;

                TRACK_GRID[trackTileIndex] = TRACK_ROAD;

                break;
            }
        }
    }

    CAR_SPEED = 0;

}

_CarMove = () => {

    if(keyHeld_Gas && CAR_SPEED < CAR_SPEED_LIMIT) {
        CAR_SPEED += CAR_DRIVE_POWER;

    } else if(keyHeld_Reverse && CAR_SPEED > -1 * CAR_SPEED_LIMIT) {
        CAR_SPEED -= CAR_REVERSE_POWER;

    }

    if(keyHeld_turnLeft && Math.abs(CAR_SPEED) > CAR_MIN_TURN_SPEED) {
        CAR_ANGLE += -(CAR_TURN_RATE) * Math.PI;

    } else if(keyHeld_turnRight && Math.abs(CAR_SPEED) > CAR_MIN_TURN_SPEED) {
        CAR_ANGLE += CAR_TURN_RATE * Math.PI;

    }

    // collision check
    // 1. feed the next x,y coordinates to _checkForTrackAtPixelCoord
    let CAR_X_NEXT = CAR_X + CAR_SPEED * Math.cos(CAR_ANGLE);
    let CAR_Y_NEXT = CAR_Y + CAR_SPEED * Math.sin(CAR_ANGLE);

    // 2. if it returns true proceed to move
    if( _checkForTrackAtPixelCoord(CAR_X_NEXT, CAR_Y_NEXT) ) {
        CAR_X = CAR_X_NEXT;
        CAR_Y = CAR_Y_NEXT;
    } else { // 3. else ?
        CAR_SPEED *= -0.35;
    }

    document.getElementById('debugText').innerHTML = `current car speed: [${CAR_SPEED}]`;
    CAR_SPEED *= GROUNDSPEED_DECAY_MULT; // decrease the speed of car each frame
}

_carInit = () => {

    _carReset();

}
