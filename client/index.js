import { render, renderanimated } from "./render.js";
import { inputMouse, getMousePos } from "./mouse.js";
import { inputServer } from "./input.js";
import { step, login, onStep, renderhtml } from "./logic.js";

window.onload = function () {
  render();
  inputMouse();
  inputServer();
  onStep(0);
  step(new Date().getTime());
  login();
  renderhtml();
};

var resizeId;
window.addEventListener(
  "resize",
  function (event) {
    clearTimeout(resizeId);
    resizeId = setTimeout(render, 500);
  },
  true
);
