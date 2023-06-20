/*

A library that extends any chessboard library to allow users to draw arrows and circles.
Right-click to draw arrows and circles, left-click to clear the drawings.

Author: Brendon McBain
Date: 07/04/2020

*/

var ChessboardArrows = function (id, RES_FACTOR = 2, COLOUR = 'rgb(50, 104, 168)', onClear = function() {}) {

const NUM_SQUARES = 8;
var resFactor, colour, drawCanvas, drawContext, primaryCanvas, primaryContext, initialPoint, mouseDown

resFactor = RES_FACTOR;
colour = COLOUR;

// drawing canvas
drawCanvas = document.getElementById('drawing-canvas');
drawContext = changeResolution(drawCanvas, resFactor);
setContextStyle(drawContext);

// primary canvas
primaryCanvas = document.getElementById('primary-canvas');
primaryContext = changeResolution(primaryCanvas, resFactor);
setContextStyle(primaryContext);

// setup mouse event callbacks
var board = document.getElementById(id);
board.addEventListener("mousedown", (event) => onMouseDown(event));
board.addEventListener("mouseup", (event) => onMouseUp(event));
board.addEventListener("mousemove", (event) => onMouseMove(event));
board.addEventListener('contextmenu', (e) => e.preventDefault(), false);
// board.removeEventListener('mousedown', onMouseDown(event))
// board.removeEventListener('mouseup', onMouseUp(event))
// board.removeEventListener('mousemove', onMouseMove(event))
// board.removeEventListener('contextmenu', e.preventDefault())
// initialise vars
initialPoint = { x: null, y: null };
finalPoint = { x: null, y: null };
arrowWidth = 18;
mouseDown = false;


// source: https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
function clearDrawings() {
    drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    primaryContext.clearRect(0, 0, primaryCanvas.width, primaryCanvas.height);
    onClear();
}
function setContextStyle(context) {
    context.strokeStyle = context.fillStyle = colour;
    context.lineJoin = 'butt';
}
function setColour(c, context) {
    colour = c;
    setContextStyle(context);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Q(evt.clientX - rect.left),
      y: Q(evt.clientY - rect.top)
    };
}
function onMouseDown(event) {
    if (event.which == 3) { // right click
        mouseDown = true;
        initialPoint = finalPoint = getMousePos(drawCanvas, event);
        drawCircle(drawContext, initialPoint.x, initialPoint.y, primaryCanvas.width/(resFactor*NUM_SQUARES*2) - 1);
    }
}
function onMouseUp(event) {
    if (event.which == 3) { // right click
        mouseDown = false;
        // if starting position == ending position, draw a circle to primary canvas
        if (initialPoint.x == finalPoint.x && initialPoint.y == finalPoint.y) {
            drawCircle(primaryContext, initialPoint.x, initialPoint.y, primaryCanvas.width/(resFactor*NUM_SQUARES*2) - 1); // reduce radius of square by 1px
        }
        // otherwise draw an arrow 
        else {
            drawArrowToCanvas(primaryContext);
        }
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }
    else if (event.which == 1) { // left click
        // clear canvases
        clearDrawings();
    }
}
function onMouseMove(event) {
    finalPoint = getMousePos(drawCanvas, event);

    if (!mouseDown) return;
    if (initialPoint.x == finalPoint.x && initialPoint.y == finalPoint.y) return;

    drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawArrowToCanvas(drawContext);
}

function drawArrow(context, fromx, fromy, tox, toy, r) {
	var x_center = tox;
	var y_center = toy;
	var angle, x, y;
	
	context.beginPath();
	
	angle = Math.atan2(toy-fromy,tox-fromx)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;

	context.moveTo(x, y);
	
	angle += (1/3)*(2*Math.PI)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;
	
	context.lineTo(x, y);
	
	angle += (1/3)*(2*Math.PI)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;
	
	context.lineTo(x, y);
	context.closePath();
	context.fill();
}
function drawArrowToCanvas(context) {
    // offset finalPoint so the arrow head hits the center of the square
    var xFactor, yFactor, offsetSize;
    if (finalPoint.x == initialPoint.x) {
        yFactor = Math.sign(finalPoint.y - initialPoint.y)*arrowWidth;
        xFactor = 0
    }
    else if (finalPoint.y == initialPoint.y) {
        xFactor = Math.sign(finalPoint.x - initialPoint.x)*arrowWidth;
        yFactor = 0;
    }
    else {
        // find delta x and delta y to achieve hypotenuse of arrowWidth
        slope_mag = Math.abs((finalPoint.y - initialPoint.y)/(finalPoint.x - initialPoint.x));
        xFactor = Math.sign(finalPoint.x - initialPoint.x)*arrowWidth/Math.sqrt(1 + Math.pow(slope_mag, 2));
        yFactor = Math.sign(finalPoint.y - initialPoint.y)*Math.abs(xFactor)*slope_mag;
    }

    // draw line
    context.beginPath();
    // context.lineCap = "round";
    context.lineWidth = 10;
    context.moveTo(initialPoint.x, initialPoint.y);
    context.lineTo(finalPoint.x - xFactor, finalPoint.y - yFactor);
    context.stroke();

    // draw arrow head
    drawArrow(context, initialPoint.x, initialPoint.y, finalPoint.x - xFactor, finalPoint.y - yFactor, arrowWidth);
}
function Q(x, d) {  // mid-tread quantiser
    d = primaryCanvas.width/(resFactor*NUM_SQUARES);
    return d*(Math.floor(x/d) + 0.5);
}
function drawCircle(context, x, y, r) {
    context.beginPath();
    context.lineWidth = 4;
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.stroke();
}

// source: https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas
function changeResolution(canvas, scaleFactor) {
    // Set up CSS size.
    canvas.style.width = canvas.style.width || canvas.width + 'px';
    canvas.style.height = canvas.style.height || canvas.height + 'px';

    // Resize canvas and scale future draws.
    canvas.width = Math.ceil(canvas.width * scaleFactor);
    canvas.height = Math.ceil(canvas.height * scaleFactor);
    var ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    return ctx;
}

function drawArrowFromSquare(start, stop, orientation) {
    var files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    var ss = parseInt(primaryCanvas.style.width) / NUM_SQUARES;
    initialPoint.y = ( 8 - parseInt(start.charAt(1), 10) ) * ss + ( ss / 2 );
    finalPoint.y = ( 8 - parseInt(stop.charAt(1), 10) ) * ss + ( ss / 2 );
    if (orientation == 'black') {
        files.reverse();
        initialPoint.y = parseInt(start.charAt(1), 10) * ss - ( ss / 2 );
        finalPoint.y = parseInt(stop.charAt(1), 10) * ss - ( ss / 2 );
    }
    initialPoint.x = ( files.indexOf(start.charAt(0)) * ss ) + ( ss / 2 );
    finalPoint.x = files.indexOf(stop.charAt(0)) * ss + ( ss / 2 );
    drawArrowToCanvas(primaryContext);
}

return { 
    drawArrowFromSquare,
    clear: clearDrawings,
    onClear,
    changeResolution,
    setContextStyle,
    setColour,
    primaryContext,
    drawContext
}

}