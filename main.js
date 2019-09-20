
let _CANVAS, _CANVAS_CONTEXT;
const _FPS = 30;

let CAR_X, CAR_Y, CAR_ANGLE = (-0.5 * Math.PI); // CAR_ANGLE faces north
let CAR_SPEED;
const CAR_DRIVE_POWER = 1, CAR_REVERSE_POWER = 0.8, CAR_TURN_RATE = 0.03, CAR_MIN_TURN_SPEED = 0.5, CAR_SPEED_LIMIT = 14, GROUNDSPEED_DECAY_MULT = 0.94;


const TRACK_COLS = 20, TRACK_ROWS = 15, TRACK_GAP = 1;
let TRACK_GRID = 
[
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 0, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, // added a 2, tells the start position for the car
    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]

const TRACK_ROAD = 0, TRACK_WALL = 1, TRACK_PLAYER = 2;

// keyboard keyCode values save to constants
const KEY_UP_ARROW = 38, KEY_DOWN_ARROW = 40, KEY_LEFT_ARROW = 37, KEY_RIGHT_ARROW = 39;
const KEY_W = 87, KEY_S = 83, KEY_A = 65, KEY_D = 68;

// keyboard hold state variables
let keyHeld_Gas = false, keyHeld_Reverse = false, keyHeld_turnLeft = false, keyHeld_turnRight = false;

let carImg = document.createElement("img");
let carImgLoaded = false;


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

window.onload = () => {
    _CANVAS = document.getElementById('gameCanvas');
    _CANVAS_CONTEXT = _CANVAS.getContext('2d');

    TRACK_W = _CANVAS.width / TRACK_COLS; TRACK_H = _CANVAS.height / TRACK_ROWS;
    // calculate the width and height of track blocks

    _carReset();

    carImg.src = "car.png";
    // load car image
    carImg.onload = () => {
        carImgLoaded = true;
    }

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

    setInterval(function(){
        _DrawAll();
        _MoveAll();
    }, 1000 / _FPS );
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

_MoveAll = () => {

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

    /*
    CAR_X += CAR_SPEED * Math.cos(CAR_ANGLE);
    CAR_Y += CAR_SPEED * Math.sin(CAR_ANGLE);
*/
    document.getElementById('debugText').innerHTML = `current car speed: [${CAR_SPEED}]`;
    CAR_SPEED *= GROUNDSPEED_DECAY_MULT; // decrease the speed of car each frame

}

_RectFilled = (topLeftX, topLeftY, boxWidth, boxHeight, fillColor) => {
    _CANVAS_CONTEXT.fillStyle = fillColor;
    _CANVAS_CONTEXT.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);

}  // draw a filled rectangle starting from (x,y) with fillcolor

_ballFilled = (centerX, centerY, radius, fillColor) => {
    _CANVAS_CONTEXT.fillStyle = fillColor;
    _CANVAS_CONTEXT.beginPath();
    _CANVAS_CONTEXT.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    _CANVAS_CONTEXT.fill();

}  // draw a filled circle at (x,y)

_isWallAtTileCoord = (trackIndex) => {
    return (TRACK_GRID[trackIndex] == TRACK_WALL);
}

_trackTileToIndex = (trackCol, trackRow) => {
    return trackCol + TRACK_COLS * trackRow;
}

_checkForTrackAtPixelCoord = (pixelX, pixelY) => {
    let _trackCol = Math.floor(pixelX / TRACK_W);
    let _trackRow = Math.floor(pixelY / TRACK_H);

    // if statement to check if the col,row is still in range
    if(_trackCol < 0 || _trackCol >= TRACK_COLS ||
        _trackRow < 0 || _trackRow >= TRACK_ROWS) {
            return false; // close function to avoid checking out of array range and return false
        }

    let trackIndex = _trackTileToIndex(_trackCol, _trackRow);

    return (TRACK_GRID[trackIndex] == TRACK_ROAD);

    if( _isTrackAtTileCoord(trackIndex) ) {
        // in contact with a brick, now for case check
        let _prevCarX = CAR_X - CAR_SPEED_X;
        let _prevCarY = CAR_Y - CAR_SPEED_Y;
        let _prevTrackCol = Math.floor(_prevCarX / TRACK_W);
        let _prevTrackRow = Math.floor(_prevCarY / TRACK_H);

        let bothTestFailed = true;
        // flag to determine corner collisions

        // case A. ball came in horizontally: value of column is different
        if( _prevTrackCol != _trackCol) {
            let _adjacentTrackIndex = _trackTileToIndex(_prevTrackCol, _trackRow)
            // brick index of where the ball would be going towards

            if(TRACK_GRID[_adjacentTrackIndex] != 1) {
                CAR_SPEED_X *= -1; // flip the horizontal speed of the ball
                bothTestFailed = false;
            }

        }
        // case B. ball came in vertically: value of row is different
        if( _prevTrackRow != _trackRow) {
            let _adjacentTrackIndex = _trackTileToIndex(_trackCol, _prevTrackRow)

            if(TRACK_GRID[_adjacentTrackIndex] != 1) {
                CAR_SPEED_Y *= -1; // flip the vertical speed of the ball
                bothTestFailed = false;
            }
        }

        // case C. ball hit the corner of the brick: both column and row value are different
        if(bothTestFailed) { // if the ball is going into a corner with both adjacent bricks still there
            CAR_SPEED_X *= -1;
            CAR_SPEED_Y *= -1;
        }

        return true; // return true if the ball is in contact with a brick

    }else {
        return false;
    }
}

_DrawTracks = () => {

    for(col=0 ; col < TRACK_COLS ; col++) {  // for each column
        for(row=0 ; row < TRACK_ROWS ; row++) {  // for each row in that column
            let TrackTopLeftX = col * TRACK_W;
            let TrackTopLeftY = row * TRACK_H;

            if( _isWallAtTileCoord( _trackTileToIndex(col, row) )) {
                // defined constant BRICK_GAP is used to add a margin around the brick for better visibilty
                _RectFilled(TrackTopLeftX + TRACK_GAP, TrackTopLeftY + TRACK_GAP, TRACK_W -(TRACK_GAP*2), TRACK_H -(TRACK_GAP*2), 'cyan');
            }else {}

        } // end of row
    } // end of column
}

_drawBitmapCenteredAtLocationWithRotation = (graphic, atX, atY, withAngle) => {
    _CANVAS_CONTEXT.save();
    _CANVAS_CONTEXT.translate(atX, atY); // sets the point where the target will be
    _CANVAS_CONTEXT.rotate(withAngle);  // rotate by CAR_ANGLE
    _CANVAS_CONTEXT.drawImage(graphic, -graphic.width/2, -graphic.height/2);
    _CANVAS_CONTEXT.restore();
}

_DrawCar = () => {
    if(carImgLoaded) {
        _drawBitmapCenteredAtLocationWithRotation(carImg, CAR_X, CAR_Y, CAR_ANGLE);

    }
}

_DrawAll = () => {
    _RectFilled(0, 0, 800, 600, '#000000'); // fills the background with black 800 x 600

    _DrawTracks(); // draws the set of bricks

    _DrawCar();
}


/*

_Collision = () => {

    if( CAR_X > _CANVAS.width ) {
        CAR_SPEED_X *= -1;
    }else if( CAR_X < 0 ) {
        CAR_SPEED_X *= -1;
    }  // collision check for left and right wall

    if( CAR_Y > _CANVAS.height * 0.9) {  // _ballRadius added for more accurate collision

    } 

    if( CAR_Y > _CANVAS.height ) {
        _carReset();

    }else if( CAR_Y < 0 ) {
        CAR_SPEED_Y *= -1;
    }  // ball bounces off the top of the canvas, and resets if it hits the bottom of the canvas
}

*/