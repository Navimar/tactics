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

  window.addEventListener('focus', () => {
    // console.log('hi!');
    login();
  });


  document.oncontextmenu = function (e) {
    return false;
  }
  document.onselect = function (e) {
    return false;
  }

  window.addEventListener('orientationchange', function () {
    // After orientationchange, add a one-time resize event
    var afterOrientationChange = function () {
      // alert(window.orientation);
      render();
      window.removeEventListener('resize', afterOrientationChange);
    };
    window.addEventListener('resize', afterOrientationChange);
  });


  canvas.addEventListener("touchstart", e => {
    mobile = true;
    mousePos = getTouchPos(canvas, e);
    mouseCell = {
      x: Math.floor((mousePos.x - shiftX) / dh),
      y: Math.floor((mousePos.y - shiftY) / dh)
    }
    tapTime = local.time;
    tapDown = true;
    e.preventDefault();
  }, false);
  canvas.addEventListener("touchend", e => {
    mousePos = getTouchPos(canvas, e);
    mouseCell = {
      x: Math.floor((mousePos.x - shiftX) / dh),
      y: Math.floor((mousePos.y - shiftY) / dh)
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

  canvas.addEventListener("mousedown", e => {
    // alert(window.orientation);

    switch (e.which) {
      case 1:
        //Left Mouse button pressed.
        mousePos = getMousePos(canvas, e);
        mouseCell = {
          x: Math.floor((mousePos.x - shiftX) / dh),
          y: Math.floor((mousePos.y - shiftY) / dh)
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
          y: Math.floor((mousePos.y - shiftY) / dh)
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
      y: Math.floor((mousePos.y - shiftY) / dh)
    }
  }, false);
}