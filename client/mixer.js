import { data, local } from "./data.js";
import playSound from "./audio.js";

const unitAudio = (x, y, turn) => {
  let unit = data.unit.find((unit) => unit.x === x && unit.y === y);
  if (!unit) return;

  let animation = unit.animation[turn];

  if (animation) {
    switch (animation.name) {
      case "none":
        break;
      case "walk":
        playSound("walk");
        break;
      case "fly":
        break;
      case "jump":
        playSound("jump");
        break;
      case "teleport":
        playSound("teleport");

        break;
      case "worm":
        break;
      case "add":
        break;
      case "punch":
        playSound("punch");

        break;
      case "idle":
        break;
      case "shake":
        playSound("shake");

        break;
      case "polymorph":
        playSound("polymorph");

        break;
      default:
    }
    return;
  }
  if (unit.isReady && data.turn && unit.canMove && (!local.unit?.canMove || !local.unit?.isReady)) {
    return;
  }
};

export default function (turn) {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      unitAudio(x, y, turn);
    }
  }
}
