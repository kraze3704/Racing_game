
const TRACK_COLS = 20, TRACK_ROWS = 15;
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

}

_isWallAtTileCoord = (trackIndex) => {
    return (TRACK_GRID[trackIndex] == TRACK_WALL);
}

_DrawTracks = () => {

    for(col=0 ; col < TRACK_COLS ; col++) {  // for each column

        for(row=0 ; row < TRACK_ROWS ; row++) {  // for each row in that column
            
            let TrackTopLeftX = col * TRACK_W;
            let TrackTopLeftY = row * TRACK_H;

            if( _isWallAtTileCoord( _trackTileToIndex(col, row) )) {

                _CANVAS_CONTEXT.drawImage(wallImg, TrackTopLeftX, TrackTopLeftY);

            }else {

                _CANVAS_CONTEXT.drawImage(trackImg, TrackTopLeftX, TrackTopLeftY);
                
            }

        } // end of row
    } // end of column
}
