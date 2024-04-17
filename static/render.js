let fps = 60;

let renderanimated = (diff) => {
  resize(true);

  if (!diff) diff = 0;
  if (diff > 100) diff = 100;

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      renderunit(x, y, diff);
    }
  }
  renderakt();
  rendertrail();
  if (data.bonus == "choose") renderpanel();
  if (!socket.connected) tip("Разорвано соединение с сервером...", 3, 3, "#F00", 5, 200);

  rendertip();
  renderdescription();
  if (diff) {
    fps = parseInt((1000 / diff + fps * 10) / 11);
    let y = 0;
    if (fps <= 30) drawTxt("fps " + fps, 0, y, 4, "#000000", undefined, undefined, true);
    if (quality < 100)
      drawTxt(
        "quality " + Math.ceil(quality),
        0,
        (y += 0.5),
        4,
        "#000000",

        undefined,
        undefined,
        true
      );
    // drawTxt('local.seconds ' + local.seconds, 0, y += 0.5, "#000000", undefined, undefined, true);
    // drawTxt('local.lastclick ' + local.lastclick, 0, y += 0.5, "#000000", undefined, undefined, true);

    // drawTxt('dh ' + dh, 8, y += 0.5, "#000000", undefined, undefined, true);

    if (fps <= 30) {
      quality = 50;
    }
  }
  // drawTxt('size ' + (dh + 2 * (dh / 10)), 8, 0.5, "#000000", undefined, undefined, true);
};

let render = () => {
  resize();

  if (data.history) drawBackground("history.bck");
  else {
    if (data.turn == 1) {
      drawBackground("edgeTurn");
    } else {
      drawBackground("edgeWait");
    }
  }
  if (data.bonus != "choose") renderpanel();
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      renderfield(x, y);
    }
    for (let x = 0; x < 9; x++) {
      renderspoil(x, y);
    }
    // for (let x = 0; x < 9; x++) {
    //   renderunit(x, y, diff);
    // }
    if (data.chooseteam || !data.bonus == "ready") {
      for (let x = 0; x < 9; x++) {
        if (data.field[x][y] == "team1") drawImgNormal("bluestart", x, y);
        if (data.field[x][y] == "team2") drawImgNormal("orangestart", x, y);
      }
    }
  }

  if (local.sandclock) {
    drawImg("sandclock", local.sandclock.x, local.sandclock.y);
  }
};
let renderpanel = () => {
  let c = [
    [-2, 0],
    [-2, 2],
    [-2, 8],
    [-2, 6],
    [-2, 4],
    [9, 0],
    [9, 2],
    [9, 4],
    [9, 6],
    [9, 7],
  ];
  if (orientation == "h") {
    c.forEach((e) => e.reverse());
  }

  if (data.bonus == "choose") {
    let sizeadd = (local.cadr * 20) / 1000;
    let i = 0;
    for (let fx = -2; fx < 0; fx++) {
      for (let fy = 0; fy < 9; fy++) {
        if (orientation == "h") {
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
    drawPanel("abyss", c[4][0], c[4][1], 2, 2);

    if (data.finished) {
      // drawSize('frame', c[3][0], c[3][1], 2, 2)
    } else {
      // drawSize('help', c[3][0], c[3][1], 2, 2)
      if (orientation == "w") {
        drawPanel("surrender", c[2][0], c[2][1], 2, 1);
      } else drawPanel("surrenderh", c[2][0], c[2][1], 1, 2);
    }

    if (local.frame > 0) drawPanel("frame", c[3][0], c[3][1], 2, 2);

    if (data.win == "win") {
      drawPanel("win", c[0][0], c[0][1], 2, 2);
    } else if (data.win == "defeat") {
      drawPanel("defeat", c[0][0], c[0][1], 2, 2);
    } else if (data.bonus == "choose") {
      drawPanel("choose", c[0][0], c[0][1], 2, 2);
    } else if (data.bonus == "wait") {
      drawPanel("wait", c[0][0], c[0][1], 2, 2);
    } else if (data.turn) {
      drawPanel("turn", c[0][0], c[0][1], 2, 2);
    } else {
      drawPanel("turnEnemy", c[0][0], c[0][1], 2, 2);
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
    drawPanel("next", c[1][0], c[1][1], 2, 2);

    drawTxt(arr.length + "", c[1][0] + 0.15, c[1][1] + 1.6, 1, "#222");
    drawTxt(data.leftturns + "", c[0][0] + 1.5, c[0][1] + 0.1, 1, "#222");

    let goldtext = data.gold[0] + "";
    drawTxt(goldtext, c[1][0] + 0.15, c[1][1] + 0.3, 1, "#090");
    drawTxt(data.gold[1] + "", c[1][0] + 0.15, c[1][1] + 0.6 + 0.3, 1, "#f00");
    drawTxt(local.unitcn + "", c[1][0] + 1.6, c[1][1] + 0.3, 1, "#222");
    drawTxt(local.unitencn + "", c[1][0] + 1.6, c[1][1] + 0.6 + 0.3, 1, "#222");

    // drawTxt(team1 + '', c[1][0] + 0.15, c[1][1] + 0.5 + 0.15, '#090')
    // drawTxt(team2 + '', c[1][0] + 1 + 0.15, c[1][1] + 0.5 + 0.15, '#f00')
  }
  if (orientation == "h") drawPanel("scrollh", 0, 9, 9, 2);
  else drawPanel("scroll", 9, 0, 2, 9);

  // drawPanel("abyss", c[6][0], c[6][1], 2, 2);
  // drawPanel("abyss", c[7][0], c[7][1], 2, 2);
  // drawPanel("abyss", c[8][0], c[8][1], 2, 2);
  // drawPanel("abyss", c[9][0], c[9][1], 2, 2);
};

const drawUnit = (unit, x, y, sizeAdd, cropPercent = 0) => {
  sizeAdd = sizeAdd ? sizeAdd : 0;
  const groundSize = ["grass", "team1", "team2"].includes(data.field[unit.x][unit.y]) ? 56 : 0;
  if (cropPercent > 0)
    drawPropUnitCropped(
      unit.img,
      x,
      y,
      unit.m,
      unit.color,
      unit.isReady,
      unit.isActive,
      groundSize - sizeAdd,
      groundSize + sizeAdd,
      true,
      cropPercent
    );
  else
    drawPropUnit(
      unit.img,
      x,
      y,
      unit.m,
      unit.color,
      unit.isReady,
      unit.isActive,
      groundSize - sizeAdd,
      groundSize + sizeAdd,
      true
    );
  if (local.unit == unit) drawImg("focus", x, y, true);

  if (data.field[unit.x][unit.y] === "water")
    drawImgNormal("drawn", x, y, fieldmask[unit.x][unit.y], true);

  if (unit.sticker) drawSticker(unit.sticker.img, x, y, unit.sticker.color);

  unit.status.forEach((stt) =>
    drawStatus(stt, x, y, unit.m, unit.color, unit.isReady, unit.isActive)
  );
};

const renderunit = (x, y, diff) => {
  let unit = data.unit.find((unit) => unit.x === x && unit.y === y);
  if (!unit) return;

  const amItarget =
    data?.order?.akt?.img && unit.x === data.order.akt.x && unit.y === data.order.akt.y;
  // const amIhero = u == local.unit;

  // console.log(data.trail);

  if (data.trail.find((t) => t.x == unit.x && t.y == unit.y && t.img == "addunit")) {
    animateAdd(unit, diff);
    return;
  }
  if (data.trail.find((t) => t.x == unit.x && t.y == unit.y && t.img == "polymorph")) {
    animatePolymorph(unit, diff);
    return;
  }
  if (amItarget && ["move", "take"].includes(data.order.akt.img)) {
    animateWalk(unit, diff);
    return;
  }
  if (amItarget && ["fly"].includes(data.order.akt.img)) {
    animateFlight(unit, diff);
    return;
  }
  if (amItarget && ["teleport"].includes(data.order.akt.img)) {
    animateTeleport(unit, diff);
    return;
  }
  if (
    data.order?.unit?.tp != "worm" &&
    data?.order?.unit?.x == unit.x &&
    data?.order?.unit?.y == unit.y &&
    isAdjacent(unit.x, unit.y, data?.order?.akt?.x, data?.order?.akt?.y)
  ) {
    animatePunch(unit, diff); // Анимация "punch" для героя, когда цель рядом
    return;
  }

  if (amItarget && !["worm", "random", "change"].includes(data.order.akt.img)) {
    animateShake(unit, diff);
    return;
  }
  if (
    (unit.isReady || unit.isActive) &&
    data.turn &&
    unit.canMove &&
    !data.chooseteam &&
    (!local.unit.canMove || !local.unit.isReady)
  ) {
    animateBreath(unit, diff);
    return;
  }
  drawUnit(unit, unit.x, unit.y);
};

// const shouldRenderNormally = (u) => {
//   return (
//     !data.order ||
//     data.order.img === "worm" ||
//     u.x !== data.order.akt.x ||
//     u.y !== data.order.akt.y ||
//     (u.progress && u.progress > 1000)
//   );
// };

let renderfield = (x, y) => {
  let v = 0;
  drawImgNormal(data.field[x][y], x, y + v, fieldmask[x][y]);
  if (data.field[x][y - 1] && data.field[x][y - 1] != data.field[x][y])
    drawImgNormal("ns" + data.field[x][y - 1] + data.field[x][y], x, y - 0.5, fieldmask[x][y]);
  if (data.field[x - 1] && data.field[x - 1][y] != data.field[x][y])
    drawImgNormal("we" + data.field[x - 1][y] + data.field[x][y], x - 0.5, y, fieldmask[x][y]);
  if (data.turn)
    if (data.field[x][y] == "team1" && data.gold[0] >= local.cost) drawImg("canBuild", x, y);
};

let renderspoil = (x, y) => {
  let u = data.spoil.filter((u) => u.x == x && u.y == y);
  u.forEach((s) => {
    drawSpoil(s.name, s.x, s.y);
  });
};
let renderakt = () => {
  if (local.unit?.akt) {
    local.unit.akt.forEach((a) => {
      if (local.unit.color == 3 && !local.unit.canMove) return;
      if (local.unit.canMove) {
        let sizeAdd = (local.cadr * 20) / 1000;
        drawAkt(a.img, a.x, a.y, -sizeAdd, sizeAdd, false);
        return;
      }
      if (!local.unit.canMove) {
        drawAkt(a.img, a.x, a.y, a.x, a.y, true);
        return;
      }
    });
  }
};
let rendertrail = () => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      let u = data.trail.filter((u) => u.x == x && u.y == y);
      u.forEach((t) => {
        drawTrail(t.img, t.x, t.y);
      });
    }
  }
};
let rendertip = () => {
  if (local.tip && local.tip.dur > 0)
    drawTxt(
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

let renderdescription = () => {
  if (local.unit) {
    let namecolor = "#006600";
    if (local.unit.color == 2) namecolor = "#660000";
    if (local.unit.color == 3) namecolor = "#666600";
    if (orientation == "h") {
      drawTxt(local.unit.name, 0.2, 9.2, 2, namecolor, 130, false, true);
      drawTxt(local.unit.description, 0.2, 9.7, 8.55, "#000000", 100, false, true);
    } else {
      drawTxt(local.unit.name, 9, 0.2, 1.85, namecolor, 130, false, true);
      drawTxt(local.unit.description, 9, 0.7, 1.85, "#000000", 100, false, true);
    }
  }
};
