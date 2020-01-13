let mousePos;
let mouseDown; let mouseCell = { x: 0, y: 0 };

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    }
}

function inputMouse() {
    document.oncontextmenu = function (e) {
        return false;
    }
    canvas.addEventListener("mousedown", e => {
        switch (e.which) {
            case 1:
                //Left Mouse button pressed.
                mousePos = getMousePos(canvas, e);
                mouseCell = {
                    x: Math.floor((mousePos.x - shiftX) / dh),
                    y: Math.floor((mousePos.y) / dh)
                }
                mouseDown = true;
                onMouseDown();
                break;
            case 2:
                break;
            case 3:
                mousePos = getMousePos(canvas, e);
                mouseCell = {
                    x: Math.floor((mousePos.x - shiftX) / dh),
                    y: Math.floor((mousePos.y) / dh)
                }
                mouseDown = true;
                onMouseDownRight();
                return false;
                break;
            default:
                alert('You have a wierd mouse!');
        }
    }, false);
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
