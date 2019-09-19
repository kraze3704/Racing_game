
let _CANVAS, _CANVAS_CONTEXT;
const _FPS = 30;

let CAR_X, CAR_Y, CAR_ANGLE = 0;
let CAR_SPEED_X, CAR_SPEED_Y;

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
    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]

let carImg = document.createElement("img");
let carImgLoaded = false;


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
        document.getElementById("debugText").innerHTML = "KeyCode pushed: " + evt.keyCode;
    });
    document.addEventListener("keyup", keyReleased = (evt) => {
        document.getElementById("debugText").innerHTML = "KeyCode released: " + evt.keyCode;
    });

    setInterval(function(){
        _DrawAll();
        _MoveAll();
    }, 1000 / _FPS );
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

_carReset = () => {

    CAR_X = _CANVAS.width / 2 + 50;
    CAR_Y = _CANVAS.height / 2;

    CAR_SPEED_X = 4;
    CAR_SPEED_Y = 6;

}

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

_MoveAll = () => {

    _Collision();

    _bounceOffTrackAtPixelCoord(CAR_X, CAR_Y);

    /*
    if(BRICK_COUNT == 0) { // if there are no more bricks left
        _resetBall(); // reset ball position and speed
        _ResetBricks(); // reset all the bricks
    }
    */

    CAR_Y += CAR_SPEED_Y;
    CAR_X += CAR_SPEED_X;
}

_trackTileToIndex = (trackCol, trackRow) => {
    return trackCol + TRACK_COLS * trackRow;
}

_isTrackAtTileCoord = (trackIndex) => {
    return (TRACK_GRID[trackIndex] == 1);
}

_bounceOffTrackAtPixelCoord = (pixelX, pixelY) => {
    let _trackCol = Math.floor(pixelX / TRACK_W);
    let _trackRow = Math.floor(pixelY / TRACK_H);

    // if statement to check if the col,row is still in range
    if(_trackCol < 0 || _trackCol >= TRACK_COLS ||
        _trackRow < 0 || _trackRow >= TRACK_ROWS) {
            return false; // close function to avoid checking out of array range and return false
        }

    let trackIndex = _trackTileToIndex(_trackCol, _trackRow);

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
            // calculate the coordinates where each brick will be in
            let TrackTopLeftX = col * TRACK_W;
            let TrackTopLeftY = row * TRACK_H;

            if( _isTrackAtTileCoord(_trackTileToIndex(col, row) ) ){ // check if the brick is still there
                // defined constant BRICK_GAP is used to add a margin around the brick for better visibilty
                _RectFilled(TrackTopLeftX + TRACK_GAP, TrackTopLeftY + TRACK_GAP, TRACK_W -(TRACK_GAP*2), TRACK_H -(TRACK_GAP*2), 'cyan');
            }else{} // if the grid value is false brick is not drawn
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
    CAR_ANGLE += 0.2;

    if(carImgLoaded) {
        _drawBitmapCenteredAtLocationWithRotation(carImg, CAR_X, CAR_Y, CAR_ANGLE);

    }
}

_DrawAll = () => {
    _RectFilled(0, 0, 800, 600, '#000000'); // fills the background with black 800 x 600

    _DrawTracks(); // draws the set of bricks

    _DrawCar();
}