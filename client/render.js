import draw from "./draw.js";
import { data, system, local } from "./data.js";
import { tip } from "./util.js";
import { socket } from "./input.js";
import animate from "./animation.js";
import description from "./description.js";
let fps = 60;

let fieldmask = (() => {
  let arr = [];
  for (let y = 0; y < 9; y++) {
    arr[y] = [];
    for (let x = 0; x < 9; x++) {
      arr[y][x] = [Math.random(), Math.random()];
    }
  }
  return arr;
})();

let renderpanel = () => {
  let c = [
    [9, 0],
    [9, 2],
    [9, 8],
    [9, 6],
    [9, 4],
  ];
  if (system.orientation == "h") {
    c.forEach((e) => e.reverse());
  }

  if (data.bonus == "choose") {
    let sizeadd = (local.cadr * 20) / 1000;
    let i = 0;
    for (let fx = -2; fx < 0; fx++) {
      for (let fy = 0; fy < 9; fy++) {
        if (system.orientation == "h") {
          drawProp("bonus", fy, fx, 1 + sizeadd, 1 - sizeadd);
          drawTxt(("0" + i).slice(-2), fy + 0.25, fx + 0.15, "#000", 170);
        } else {
          drawProp("bonus", fx, fy, 1 + sizeadd, 1 - sizeadd);
          drawTxt(("0" + i).slice(-2), fx + 0.25, fy + 0.15, "#000", 170);
        }
        i++;
      }
    }
  } else {
    draw.drawPanel("abyss", c[4][0], c[4][1], 2, 2);

    if (data.finished) {
      // drawSize('frame', c[3][0], c[3][1], 2, 2)
    } else {
      // drawSize('help', c[3][0], c[3][1], 2, 2)
      if (system.orientation == "w") {
        draw.drawPanel("surrender", c[2][0], c[2][1], 2, 1);
      } else draw.drawPanel("surrenderh", c[2][0], c[2][1], 1, 2);
    }

    if (local.frame > 0) draw.drawPanel("frame", c[3][0], c[3][1], 2, 2);

    if (data.win == "win") {
      draw.drawPanel("win", c[0][0], c[0][1], 2, 2);
    } else if (data.win == "defeat") {
      draw.drawPanel("defeat", c[0][0], c[0][1], 2, 2);
    } else if (data.bonus == "choose") {
      draw.drawPanel("choose", c[0][0], c[0][1], 2, 2);
    } else if (data.bonus == "wait") {
      draw.drawPanel("wait", c[0][0], c[0][1], 2, 2);
    } else if (data.turn) {
      draw.drawPanel("turn", c[0][0], c[0][1], 2, 2);
    } else {
      draw.drawPanel("turnEnemy", c[0][0], c[0][1], 2, 2);
    }

    // drawTxt(local.fisher[0] + '', c[0][0] + 0.15, c[0][1] + 0.4 + 0.15, '#090')
    // drawTxt(local.fisher[1] + '', c[0][0] + 1 + 0.15, c[0][1] + 0.4 + 0.15, '#f00')
    let team1 = 0;
    let team2 = 0;

    data.unit.forEach((u) => {
      if (u.color == 1) team1 += u.life;
      if (u.color == 2) team2 += u.life;
    });
    if (team1 - team2 > 0) {
      team1 -= team2;
      team2 -= team2;
    } else {
      team2 -= team1;
      team1 -= team1;
    }

    let arr = [];
    data.unit.forEach((u) => {
      if (u.color == 1 && u.isReady && !u.isActive) {
        arr.push(u);
      }
    });
    draw.drawPanel("next", c[1][0], c[1][1], 2, 2);
    if (data.win != "win" && data.win != "defeat")
      draw.drawTxt(data.leftturns + "⌛", c[0][0] + 0.5, c[0][1] + 0.35, 1.5, "#222", 150);
  }
  if (system.orientation == "h") draw.drawPanel("scrollh", 0, -3, 9, 3);
  else draw.drawPanel("scroll", -3, 0, 3, 9);
};

export const drawUnit = (unit) => {
  if (!local.once) {
    local.once = true;
  }
  unit.sizeAdd = unit.sizeAdd || 0;
  let cellX = Math.round(unit.x);
  let cellY = Math.round(unit.y);
  if (!(cellX >= 0 && cellX < 9 && cellY < 9 && cellY >= 0)) return true;

  const groundSize = ["grass", "team1", "team2"].includes(data.field[cellX][cellY]) ? 56 : 0;

  if (unit.cropPercent)
    draw.drawPropUnitCropped(
      unit.img,
      unit.x,
      unit.y,
      unit.m,
      unit.color,
      unit.isReady,
      unit.isActive,
      groundSize - unit.sizeAdd,
      groundSize + unit.sizeAdd,
      !unit.static,
      unit.cropPercent
    );
  else
    draw.drawPropUnit(
      unit.img,
      unit.x,
      unit.y,
      unit.m,
      unit.color,
      unit.isReady,
      unit.isActive,
      groundSize - unit.sizeAdd,
      groundSize + unit.sizeAdd,
      !unit.static
    );
  if (unit.focused) draw.drawImg("focus", unit.x, unit.y, true);
  if (data.field[cellX][cellY] === "water")
    draw.drawImgMask("drawn", unit.x, unit.y, fieldmask[cellX][cellY], true);

  if (unit.sticker)
    draw.drawSticker(unit.sticker.img, unit.x, unit.y, unit.sticker.color, !unit.static);

  unit.status?.forEach((stt) => draw.drawStatus(stt, unit.x, unit.y, true));
};

const renderunit = (x, y) => {
  let unit = data.unit.find((unit) => unit.x === x && unit.y === y);
  if (!unit) return;
  unit = { ...unit, focused: local.unit == unit ? true : false };

  let animation = unit.animation[local.animationTurn];

  if (animation) {
    switch (animation.name) {
      case "none":
        break;
      case "walk":
        animate.walk(unit, animation.fromX, animation.fromY);
        break;
      case "fly":
        animate.flight(unit, animation.fromX, animation.fromY);
        break;
      case "jump":
        animate.jump(unit, animation.fromX, animation.fromY);
        break;
      case "teleport":
        animate.teleport(unit, animation.fromX, animation.fromY);
        break;
      case "worm":
        animate.worm(unit, animation.fromX, animation.fromY);
        break;
      case "add":
        animate.add(unit);
        break;
      case "punch":
        animate.punch(unit, animation.targetX, animation.targetY);
        break;
      case "idle":
        drawUnit({ ...unit, x: animation.fromX, y: animation.fromY });
        break;
      case "shake":
        animate.shake(unit);
        break;
      case "polymorph":
        animate.polymorph(unit, animation.img);
        break;
      default:
        drawUnit({ ...unit, static: true });
        console.log("Unknown animation:", animation.name);
    }
    return;
  }
  if (unit.isReady && data.turn && unit.canMove && (!local.unit?.canMove || !local.unit?.isReady)) {
    animate.breath(unit);
    return;
  }
  drawUnit({ ...unit, static: true });
};

let renderfield = (x, y) => {
  if (!data.field) return;
  let v = 0;
  draw.drawImgMask(data.field[x][y], x, y + v, fieldmask[x][y]);
  if (data.field[x][y - 1] && data.field[x][y - 1] != data.field[x][y])
    draw.drawImgFieldConnection(
      "ns" + data.field[x][y - 1] + data.field[x][y],
      x,
      y - 0.5,
      fieldmask[x][y]
    );
  if (data.field[x - 1] && data.field[x - 1][y] != data.field[x][y])
    draw.drawImgFieldConnection(
      "we" + data.field[x - 1][y] + data.field[x][y],
      x - 0.5,
      y,
      fieldmask[x][y]
    );
  if (data.turn)
    if (data.field[x][y] == "team1" && data.gold[0] >= local.cost) drawImg("canBuild", x, y);
};

let renderoldfield = (x, y) => {
  let v = 0;
  draw.drawImgMask(local.oldfield[x][y], x, y + v, fieldmask[x][y]);
  if (local.oldfield[x][y - 1] && local.oldfield[x][y - 1] != local.oldfield[x][y])
    drawImgFieldConnection(
      "ns" + local.oldfield[x][y - 1] + local.oldfield[x][y],
      x,
      y - 0.5,
      fieldmask[x][y]
    );
  if (local.oldfield[x - 1] && local.oldfield[x - 1][y] != local.oldfield[x][y])
    drawImgFieldConnection(
      "we" + local.oldfield[x - 1][y] + local.oldfield[x][y],
      x - 0.5,
      y,
      fieldmask[x][y]
    );
};

let renderspoil = (x, y) => {
  let u = data.spoil.filter((u) => u.x == x && u.y == y);
  u.forEach((s) => {
    if (!s.name.startsWith("fire")) draw.drawSpoil(s.name, s.x, s.y);
  });
};

let renderakt = () => {
  if (local.unit?.akt) {
    local.unit.akt.forEach((a) => {
      if (local.unit.color == 3 && !local.unit.canMove) return;
      if (local.unit.canMove) {
        if (data.turn == 1) {
          let sizeAdd = (local.cadr * 15) / 700;
          draw.drawAkt(a.img, a.x, a.y, -sizeAdd, sizeAdd, false);
          return;
        } else {
          draw.drawAkt(a.img, a.x, a.y, 0, 0, "disabled");
          return;
        }
      }
      if (!local.unit.canMove) {
        draw.drawAkt(a.img, a.x, a.y, 0, 0, "enemy");
        return;
      }
    });
  }
};

let rendertrail = (x, y) => {
  let p = data.trail.filter((p) => p.x == x && p.y == y);
  p.forEach((trail) => {
    trail.turn = trail.turn || 0;
    if (local.animationTurn == trail.turn) {
      switch (trail.name) {
        case "death":
          animate.trailDeath(trail.unit, trail.x, trail.y);
          break;
        case "fly":
          animate.flight(trail.unit, trail.x, trail.y);
          break;
        case "jump":
          animate.jump(trail.unit, trail.x, trail.y);
          break;
        case "idle":
          drawUnit({ ...trail.unit, x: trail.x, y: trail.y });
          break;
        case "launch":
          animate.launch(trail.unit, trail.x, trail.y);
          break;
        case "fall":
          animate.fall(trail.unit, trail.x, trail.y);
          break;
        default:
          // Обработка случая, если имя trail не соответствует ни одному из вариантов
          break;
      }
    }
  });
};
let rendertip = () => {
  if (local.tip && local.tip.dur > 0)
    draw.drawTxt(
      local.tip.text,
      local.tip.x,
      local.tip.y,
      4,
      local.tip.color,
      local.tip.size,
      false,
      true
    );
};

function renderdescription() {
  if (local.unit) {
    local.description.name = description.unit[local.unit.tp]?.name;
    local.description.description = description.unit[local.unit.tp]?.description;
    if (!local.description.name) local.description.name = local.unit.tp;
    if (!local.description.description) local.description.description = description_notfound;
    if (local.unit?.color == 1) local.description.color = "#006600";
    if (local.unit?.color == 2) local.description.color = "#660000";
    if (local.unit?.color == 3) local.description.color = "#666600";
  }

  if (local.description.name) {
    let lasty;
    if (system.orientation == "h") {
      draw.drawTxt(
        local.description.name,
        0.2,
        -2.8,
        8.55,
        local.description.color,
        130,
        false,
        false
      );
      lasty = draw.drawTxt(
        local.description.description,
        0.2,
        -2.3,
        8.55,
        "#000000",
        100,
        false,
        false
      );
      if (local.unit?.status && local.unit?.status[0]) {
        draw.drawStatus(local.unit.status[0], 0.2, lasty + 0.5, false);
        draw.drawTxt(
          description.status[local.unit.status[0]],
          1.5,
          lasty + 0.5,
          6,
          "#000000",
          100,
          false,
          false
        );
      } else {
        if (local.unit.sticker) {
          draw.drawPropUnit(
            local.unit.sticker.img,
            0.2,
            lasty + 0.5,
            false,
            local.unit.sticker.color,
            true,
            false,
            52,
            52,
            false
          );
          drawTxt(
            description.sticker + description.unit[local.unit.sticker.img]?.name,
            1.5,
            lasty + 0.5,
            6,
            "#000000",
            100,
            false,
            false
          );
        }
      }
      if (local.description.spoil) {
        draw.drawSpoil(local.description.spoil, 0.2, lasty + 0.5, false);
        draw.drawTxt(
          description.spoil[local.description.spoil] || local.description.spoil,
          1.5,
          lasty + 0.5,
          6,
          "#000000",
          100,
          false,
          false
        );
      }
    } else {
      draw.drawTxt(
        local.description.name,
        -2.92,
        0.2,
        2.9,
        local.description.color,
        130,
        false,
        false
      );
      lasty = draw.drawTxt(
        local.description.description,
        -2.92,
        0.7,
        2.9,
        "#000000",
        100,
        false,
        false
      );
      if (local.unit?.status && local.unit?.status[0]) {
        draw.drawStatus(local.unit.status[0], -2.7, lasty + 0.5, false);
        draw.drawTxt(
          description.status[local.unit.status[0]] || local.unit.status[0],
          -2.92,
          lasty + 1.7,
          2.9,
          "#000000",
          100,
          false,
          false
        );
      } else {
        if (local.unit.sticker) {
          draw.drawPropUnit(
            local.unit.sticker.img,
            -2.7,
            lasty + 0.5,
            false,
            local.unit.sticker.color,
            true,
            false,
            52,
            52,
            false
          );
          draw.drawTxt(
            description.sticker + description.unit[local.unit.sticker.img]?.name,
            -2.92,
            lasty + 1.7,
            2.9,
            "#000000",
            100,
            false,
            false
          );
        }
      }
      if (local.description.spoil) {
        drawSpoil(local.description.spoil, -2.7, lasty + 0.5, false);
        drawTxt(
          description.spoil[local.description.spoil] || local.description.spoil,
          -2.92,
          lasty + 1.7,
          2.9,
          "#000000",
          100,
          false,
          false
        );
      }
    }
  }
}

export const render = () => {
  draw.resize();

  if (data.history) draw.drawBackground("history");
  else {
    if (data.turn == 1) {
      draw.drawBackground("edgeTurn");
    } else {
      draw.drawBackground("edgeWait");
    }
  }

  if (data.bonus != "choose") renderpanel();
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      renderfield(x, y);
      if (
        local.animationTurn < 2 &&
        local.oldfield &&
        local.oldfield[x][y] == "grass" &&
        data.field[x][y] == "ground"
      )
        draw.drawImgMask("grass", x, y, fieldmask[x][y], false);
    }
    for (let x = 0; x < 9; x++) {
      renderspoil(x, y);
    }
    // for (let x = 0; x < 9; x++) {
    //   renderunit(x, y, diff);
    // }
    if (data.chooseteam || !data.bonus == "ready") {
      for (let x = 0; x < 9; x++) {
        if (data.field[x][y] == "team1") draw.drawImgMask("bluestart", x, y);
        if (data.field[x][y] == "team2") draw.drawImgMask("orangestart", x, y);
      }
    }
  }

  if (local.sandclock) {
    draw.drawImg("sandclock", local.sandclock.x, local.sandclock.y);
  }

  renderdescription();
  rendertip();
};

export const renderanimated = (diff) => {
  draw.resize(true);

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (local.animationTurn != local.renderedturn && local.animationTurn < 4) {
        local.renderedturn = local.animationTurn;
        render();
      }

      let u = data.spoil.filter((u) => u.x == x && u.y == y);
      u.forEach((spoil) => {
        let spoil_animation;
        if (spoil.animation) spoil_animation = spoil.animation[local.animationTurn];

        if (spoil_animation) {
          switch (spoil_animation.name) {
            case "none":
              break;
          }
          return;
        }
        if (spoil.name.startsWith("fire")) draw.drawSpoil(spoil.name, spoil.x, spoil.y, true);
      });

      rendertrail(x, y);
      renderunit(x, y);
    }
  }
  renderakt();
  if (data.bonus == "choose") renderpanel();
  if (!socket.connected)
    local.tip = tip("Разорвано соединение с сервером...", 3, 3, "#F00", 5, 200);

  if (!diff) diff = 0;
  if (diff > 100) diff = 100;
  if (diff) {
    fps = Math.ceil(1000 / diff);
    let x = -2.85;
    let y = 8;
    if (system.orientation == "h") {
      x = 6.85;
      y = -0.4;
    }

    // drawTxt("fps " + fps, x, y - 0.2, 2, "#000000", undefined, undefined, true);
    let total = local.position[0] + local.position[1];
    let percentage1 = total > 0 ? ((local.position[0] / total) * 100).toFixed(1) : 0;
    let percentage2 = total > 0 ? ((local.position[1] / total) * 100).toFixed(1) : 0;

    draw.drawTxt(
      `p1 ${percentage1}% (${local.position[0]})`,
      x,
      y,
      2,
      "#000000",
      undefined,
      undefined,
      true
    );
    draw.drawTxt(
      `p2 ${percentage2}% (${local.position[1]})`,
      x,
      y + 0.4,
      2,
      "#000000",
      undefined,
      undefined,
      true
    );
  }
};
