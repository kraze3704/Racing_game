
let _CANVAS, _CANVAS_CONTEXT;
const _FPS = 30;

let _ballX, _ballY, _ballRadius = 10;
let _ballSpeedX, _ballSpeedY;

let _paddleX, _paddleY, _paddleHeight = 15, _paddleWidth = 150;

const BRICK_WIDTH = 80, BRICK_HEIGHT = 20, BRICK_GAP = 2, BRICK_COLS = 10, BRICK_ROWS = 14;
// collision width&height of the brick, visiual gap, number of columns and rows

let BRICK_GRID = new Array(BRICK_COLS * BRICK_ROWS), BRICK_COUNT = 0;

window.onload = () => {
    _CANVAS = document.getElementById('gameCanvas');
    _CANVAS_CONTEXT = _CANVAS.getContext('2d');

    _resetBall(); // places the ball at the center of canvas with speed (0,6)
    _ResetBricks();

    _paddleX = (_CANVAS.width - _paddleWidth) / 2;
    _paddleY = _CANVAS.height * 0.9;

    _CANVAS.addEventListener('mousemove', function(evt) {
        let mousePos = calculateMousePos(evt);
        _paddleX = mousePos.x - (_paddleWidth/2);
    });

    setInterval(function(){
        _DrawAll();
        _MoveAll();
    }, 1000 / _FPS );
}

calculateMousePos = (evt) => {
    let rect = _CANVAS.getBoundingClientRect(), root = document.documentElement;

    // account for margins, canvas position on page, scroll amount etc.
    let _mouseX = evt.clientX - rect.left - root.scrollLeft;
    let _mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: _mouseX,
        y: _mouseY
    };
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

_resetBall = () => {

    _ballX = _CANVAS.width / 2;
    _ballY = _CANVAS.height / 2;

    _ballSpeedX = 0;
    _ballSpeedY = 6;

}

_paddleCollision = () => {

    if(_ballSpeedY > 0) { // paddle collision will only happen when the ball is moving downwards
        _ballSpeedY *= -1;

        let _ballSpeedX_Mod = _ballX - _paddleX - (_paddleWidth/2);

        _ballSpeedX = _ballSpeedX_Mod/10;
    }
}

_Collision = () => {

    if( _ballX + _ballRadius > _CANVAS.width ) {
        _ballSpeedX *= -1;
    }else if( _ballX - _ballRadius < 0 ) {
        _ballSpeedX *= -1;
    }  // collision check for left and right wall

    if( _ballY + _ballRadius > _CANVAS.height * 0.9) {  // _ballRadius added for more accurate collision

        if( _ballX > _paddleX && _ballX < _paddleX + _paddleWidth) {
            _paddleCollision();
        }

    } // before reaching the edge, check for paddle collision and run the code if the ball is in contact with paddle

    if( _ballY > _CANVAS.height ) {
        _resetBall();

    }else if( _ballY - _ballRadius < 0 ) {
        _ballSpeedY *= -1;
    }  // ball bounces off the top of the canvas, and resets if it hits the bottom of the canvas
}

_MoveAll = () => {

    _Collision();

    _breakAndBounceOffBrickAtPixelCoord(_ballX, _ballY);

    if(BRICK_COUNT == 0) { // if there are no more bricks left
        _resetBall(); // reset ball position and speed
        _ResetBricks(); // reset all the bricks
    }

    _ballY += _ballSpeedY;
    _ballX += _ballSpeedX;
}

_ResetBricks = () => {

    for(i=0 ; i < BRICK_COLS ; i++){
        for(j=0 ; j < BRICK_ROWS ; j++){
            if(j < 3) {} // empty first three rows of the bricks
            else {
                BRICK_GRID[BRICK_COLS*j + i] = true;
                BRICK_COUNT++; // add a brick counter for each brick
            }
        }
    };
    //console.dir(BRICK_GRID);
}

_brickTileToIndex = (brickCol, brickRow) => {
    return brickCol + BRICK_COLS * brickRow;
}

_isBrickAtTileCoord = (brickIndex) => {
    return (BRICK_GRID[brickIndex] == 1);
}

_breakAndBounceOffBrickAtPixelCoord = (pixelX, pixelY) => {
    let _brickCol = Math.floor(pixelX / BRICK_WIDTH);
    let _brickRow = Math.floor(pixelY / BRICK_HEIGHT);

    // if statement to check if the col,row is still in range
    if(_brickCol < 0 || _brickCol >= BRICK_COLS ||
        _brickRow < 0 || _brickRow >= BRICK_ROWS) {
            return false; // close function to avoid checking out of array range and return false
        }

    let brickIndex = _brickTileToIndex(_brickCol, _brickRow);

    if( _isBrickAtTileCoord(brickIndex) ) {
        // in contact with a brick, now for case check
        let _prevBallX = _ballX - _ballSpeedX;
        let _prevBallY = _ballY - _ballSpeedY;
        let _prevBrickCol = Math.floor(_prevBallX / BRICK_WIDTH);
        let _prevBrickRow = Math.floor(_prevBallY / BRICK_HEIGHT);

        let bothTestFailed = true;
        // flag to determine corner collisions

        // case A. ball came in horizontally: value of column is different
        if( _prevBrickCol != _brickCol) {
            let _adjacentBrickIndex = _brickTileToIndex(_prevBrickCol, _brickRow)
            // brick index of where the ball would be going towards

            if(BRICK_GRID[_adjacentBrickIndex] != 1) {
                _ballSpeedX *= -1; // flip the horizontal speed of the ball
                bothTestFailed = false;
            }

        }
        // case B. ball came in vertically: value of row is different
        if( _prevBrickRow != _brickRow) {
            let _adjacentBrickIndex = _brickTileToIndex(_brickCol, _prevBrickRow)

            if(BRICK_GRID[_adjacentBrickIndex] != 1) {
                _ballSpeedY *= -1; // flip the vertical speed of the ball
                bothTestFailed = false;
            }
        }

        // case C. ball hit the corner of the brick: both column and row value are different
        if(bothTestFailed) { // if the ball is going into a corner with both adjacent bricks still there
            _ballSpeedX *= -1;
            _ballSpeedY *= -1;
        }

        BRICK_GRID[brickIndex] = 0;
        BRICK_COUNT--; // decrease the brick count by one

        return true; // return true if the ball is in contact with a brick

    }else {
        return false;
    }
}

_DrawBricks = () => {
    for(col=0 ; col < BRICK_COLS ; col++) {  // for each column
        for(row=0 ; row < BRICK_ROWS ; row++) {  // for each row in that column
            // calculate the coordinates where each brick will be in
            let BrickTopLeftX = col * BRICK_WIDTH;
            let BrickTopLeftY = row * BRICK_HEIGHT;

            if( _isBrickAtTileCoord(_brickTileToIndex(col, row) ) ){ // check if the brick is still there
                // defined constant BRICK_GAP is used to add a margin around the brick for better visibilty
                _RectFilled(BrickTopLeftX + BRICK_GAP, BrickTopLeftY + BRICK_GAP, BRICK_WIDTH -(BRICK_GAP*2), BRICK_HEIGHT -(BRICK_GAP*2), 'cyan');
            }else{} // if the grid value is false brick is not drawn
        } // end of row
    } // end of column
}

_DrawAll = () => {
    _RectFilled(0, 0, 800, 600, '#000000'); // fills the background with black 800 x 600

    _DrawBricks(); // draws the set of bricks

    _RectFilled(_paddleX, _paddleY, _paddleWidth, _paddleHeight, '#FFFFFF');

    _ballFilled(_ballX, _ballY, _ballRadius, '#FFFFFF');
}