
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

_drawBitmapCenteredAtLocationWithRotation = (graphic, atX, atY, withAngle) => {

    _CANVAS_CONTEXT.save();
    _CANVAS_CONTEXT.translate(atX, atY); // sets the point where the target will be
    _CANVAS_CONTEXT.rotate(withAngle);  // rotate by CAR_ANGLE
    _CANVAS_CONTEXT.drawImage(graphic, -graphic.width/2, -graphic.height/2);
    _CANVAS_CONTEXT.restore();

}
