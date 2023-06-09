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

  // window.addEventListener('focus', () => {
  //   // console.log('hi!');
  //   login();
  // });


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

  // canvas.addEventListener('gestureend', function (e) {
  //   console.log('gesture evt')
  //   console.log(e)
  //   if (e.scale < 1.0) {
  //     // User moved fingers closer together
  //   } else if (e.scale > 1.0) {
  //     // User moved fingers further apart
  //   }
  // }, false);

  canvasAnimated.addEventListener("touchstart", e => {
    mobile = true;
    mousePos = getTouchPos(canvasAnimated, e);
    setMouseCell()

    tapTime = local.time;
    tapDown = true;
    // drawImgNormal('tap', mouseCell.x, mouseCell.y);
    e.preventDefault();
  }, false);
  canvasAnimated.addEventListener("touchend", e => {
    mousePos = getTouchPos(canvasAnimated, e);
    setMouseCell()

    tapDown = false;
    if (local.time - tapTime < interval) {
      onMouseDown();
    }

  }, false);
  canvasAnimated.addEventListener("touchcancel", e => {

  }, false);
  canvasAnimated.addEventListener("touchmove", e => {

  }, false);

  canvasAnimated.addEventListener("mousedown", e => {
    // alert(window.orientation);

    switch (e.which) {
      case 1:
        //Left Mouse button pressed.
        mousePos = getMousePos(canvasAnimated, e);
        setMouseCell()

        mouseDown = true;
        onMouseDown();
        break;
      case 2:
        break;
      case 3:
        mousePos = getMousePos(canvasAnimated, e);
        setMouseCell()

        mouseDown = true;
        onMouseDownRight();
        return false;
        break;
      default:
        alert('You have a wierd mouse!');
    }
  }, false);
  canvasAnimated.addEventListener("mouseup", e => {
    mouseDown = false;
    mousePos = getMousePos(canvasAnimated, e);
  }, false);
  canvasAnimated.addEventListener("mousemove", e => {
    mousePos = getMousePos(canvasAnimated, e);
    setMouseCell()
  }, false);
}

let setMouseCell = () => {
  mouseCell = {
    x: Math.floor((mousePos.x - shiftX / (window.devicePixelRatio * (quality / 100))) / dh * (window.devicePixelRatio * (quality / 100))),
    y: Math.floor((mousePos.y - shiftY / (window.devicePixelRatio * (quality / 100))) / dh * (window.devicePixelRatio * (quality / 100)))
  }
}