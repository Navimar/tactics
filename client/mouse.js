import { canvasText } from "./canvas.js";
import { getDeviceType } from "./util.js";
import { data, local, system } from "./data.js";
import { onMouseDown, onMouseDownRight } from "./logic.js";

let mousePos;
let mouseDown;

let tapTime;
const interval = 200;

export function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();

  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}
function getTouchPos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.changedTouches[0].clientX - rect.left,
    y: evt.changedTouches[0].clientY - rect.top,
  };
}

let taptime;
let right = false;
export function inputMouse() {
  document.oncontextmenu = function (e) {
    return false;
  };
  document.onselect = function (e) {
    return false;
  };

  window.addEventListener("orientationchange", function () {
    // After orientationchange, add a one-time resize event
    var afterOrientationChange = function () {
      render();
      window.removeEventListener("resize", afterOrientationChange);
    };
    window.addEventListener("resize", afterOrientationChange);
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

  canvasText.addEventListener(
    "touchstart",
    (e) => {
      mobile = true;
      mousePos = getTouchPos(canvasText, e);
      setMouseCell();

      tapTime = local.time;
      system.tapDown = true;
      e.preventDefault();
    },
    false
  );
  canvasText.addEventListener(
    "touchend",
    (e) => {
      mousePos = getTouchPos(canvasText, e);
      setMouseCell();

      system.tapDown = false;
      if (local.time - tapTime < interval) {
        onMouseDown();
      }
    },
    false
  );
  canvasText.addEventListener("touchcancel", (e) => {}, false);
  canvasText.addEventListener("touchmove", (e) => {}, false);

  canvasText.addEventListener(
    "mousedown",
    (e) => {
      switch (e.which) {
        case 1:
          //Left Mouse button pressed.
          mousePos = getMousePos(canvasText, e);
          setMouseCell();

          mouseDown = true;
          onMouseDown();
          break;
        case 2:
          break;
        case 3:
          mousePos = getMousePos(canvasText, e);
          setMouseCell();

          mouseDown = true;
          onMouseDownRight();
          return false;
          break;
        default:
          alert("You have a wierd mouse!");
      }
    },
    false
  );
  canvasText.addEventListener(
    "mouseup",
    (e) => {
      mouseDown = false;
      mousePos = getMousePos(canvasText, e);
    },
    false
  );
  canvasText.addEventListener(
    "mousemove",
    (e) => {
      mousePos = getMousePos(canvasText, e);
      setMouseCell();
    },
    false
  );
}

let setMouseCell = () => {
  if (getDeviceType() == "desktop")
    system.mouseCell = {
      x: Math.floor(
        ((mousePos.x - system.shiftX / window.devicePixelRatio) / system.dh) *
          window.devicePixelRatio
      ),
      y: Math.floor(
        ((mousePos.y - system.shiftY / window.devicePixelRatio) / system.dh) *
          window.devicePixelRatio
      ),
    };
  else
    system.mouseCell = {
      x: Math.floor((mousePos.x - system.shiftX) / dh),
      y: Math.floor((mousePos.y - system.shiftY) / dh),
    };
};
