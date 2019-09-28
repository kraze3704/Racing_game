
let _CANVAS, _CANVAS_CONTEXT;
const _FPS = 30;

_loadingDoneSoStartGame = () => {

    setInterval(function(){
        _DrawAll();
        _MoveAll();
    }, 1000 / _FPS );
}

window.onload = () => {
    
    _CANVAS = document.getElementById('gameCanvas');
    _CANVAS_CONTEXT = _CANVAS.getContext('2d');

    TRACK_W = _CANVAS.width / TRACK_COLS; TRACK_H = _CANVAS.height / TRACK_ROWS;
    // calculate the width and height of track blocks

    _carInit();
    _inputInit();

    _loadImages();
}

_MoveAll = () => {

    _CarMove();

}

_DrawAll = () => {

    _DrawTracks(); // draws the set of bricks

    _DrawCar();

}