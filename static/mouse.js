let mousePos;
let mouseDown; let mouseCell = { x: 0, y: 0 };
let tapDown;
let tapTime;
const interval = 200;

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}
function getTouchPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.changedTouches[0].clientX - rect.left,
        y: evt.changedTouches[0].clientY - rect.top,
    }
}

let taptime;
let right = false;
function inputMouse() {
    document.oncontextmenu = function (e) {
        return false;
    }
    document.onselect = function (e) {
        return false;
    }
    canvas.addEventListener("touchstart", e => {
        mousePos = getTouchPos(canvas, e);
        mouseCell = {
            x: Math.floor((mousePos.x - shiftX) / dh),
            y: Math.floor((mousePos.y) / dh)
        }
        tapTime = local.time;
        tapDown = true;

    }, false);
    canvas.addEventListener("touchend", e => {
        mousePos = getTouchPos(canvas, e);
        mouseCell = {
            x: Math.floor((mousePos.x - shiftX) / dh),
            y: Math.floor((mousePos.y) / dh)
        }
        tapDown = false;
        if (local.time - tapTime < interval) {
            onMouseDown();
        }

    }, false);
    canvas.addEventListener("touchcancel", e => {

    }, false);
    canvas.addEventListener("touchmove", e => {

    }, false);

    // canvas.addEventListener("mousedown", e => {
    //     switch (e.which) {
    //         case 1:
    //             //Left Mouse button pressed.
    //             mousePos = getMousePos(canvas, e);
    //             mouseCell = {
    //                 x: Math.floor((mousePos.x - shiftX) / dh),
    //                 y: Math.floor((mousePos.y) / dh)
    //             }
    //             mouseDown = true;
    //             onMouseDown();
    //             break;
    //         case 2:
    //             break;
    //         case 3:
    //             mousePos = getMousePos(canvas, e);
    //             mouseCell = {
    //                 x: Math.floor((mousePos.x - shiftX) / dh),
    //                 y: Math.floor((mousePos.y) / dh)
    //             }
    //             mouseDown = true;
    //             onMouseDownRight();
    //             return false;
    //             break;
    //         default:
    //             alert('You have a wierd mouse!');
    //     }
    // }, false);
    canvas.addEventListener("mouseup", e => {
        mouseDown = false;
        mousePos = getMousePos(canvas, e);
    }, false);
    canvas.addEventListener("mousemove", e => {
        mousePos = getMousePos(canvas, e);
        mouseCell = {
            x: Math.floor((mousePos.x - shiftX) / dh),
            y: Math.floor((mousePos.y) / dh)
        }
    }, false);
}
