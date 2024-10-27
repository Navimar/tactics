const en = require("./engine");
const _ = require("lodash");
const meta = require("./meta");
const gm = require("./game");
const wrapper = require("./wrapper");

exports.maxEnergyLimit = (game) => {
  game.unit.forEach((u) => {
    if (u.maxenergy < u.energy) u.energy = u.maxenergy;
  });
};

exports.telepath = (game) => {
  game.unit.forEach((u) => {
    u.status.remove("telepath");
  });
};

exports.firestt = (game) => {
  game.unit.forEach((u) => {
    if (u.status.includes("fire2")) {
      en.death(game, u);
      en.addSpoil(game, "fire", u.x, u.y, false, 3);
    }
    if (u.status.includes("fire")) {
      u.status.remove("fire");
      u.status.push("fire2");
    }
  });
};

exports.mine = (game) => {
  game.unit.forEach((u) => {
    if (u.team == game.turn && u.tp == "mine") game.gold[game.turn - 1] += 3;
  });
};

exports.fireInWater = (game) => {
  for (let i = game.spoil.length - 1; i >= 0; i--) {
    let sp = game.spoil[i];
    if (
      (sp.name == "fire" || sp.name == "fire1" || sp.name == "fire2") &&
      en.inField(sp.x, sp.y) &&
      game.field[sp.x][sp.y] == "water"
    ) {
      game.spoil.splice(i, 1);
    }
  }

  game.unit.forEach((u) => {
    if (u.status.includes("fire2") && game.field[u.x][u.y] == "water") {
      u.status.remove("fire2");
    }
    if (u.status.includes("fire") && game.field[u.x][u.y] == "water") {
      u.status.remove("fire");
    }
  });
};

exports.unitInFire = (game) => {
  for (let i = game.spoil.length - 1; i >= 0; i--) {
    let sp = game.spoil[i];
    if (sp.name == "fire" || sp.name == "fire1" || sp.name == "fire2") {
      let unit = en.unitInPoint(game, sp.x, sp.y);
      if (unit) {
        en.addStatus(unit, "fire");
        game.spoil.splice(i, 1);
      }
    }
  }
};

exports.worm = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "worm" && game.spoil[i].team == game.turn) {
      let unit = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y);
      let worm = game.spoil[i].data.worm;
      if (en.isAlive(game, worm) && game.spoil[i].data.worm?.tp == "worm") {
        if (worm != unit) {
          if (unit) {
            game.trail.push({ name: "idle", x: unit.x, y: unit.y, data: { unit }, turn: 0 });
            game.trail.push({ name: "death", x: unit.x, y: unit.y, data: { unit }, turn: 1 });
            en.death(game, unit);
          }
          // en.addSpoil(
          //   game,
          //   "wormportal",
          //   game.spoil[i].data.worm.x,
          //   game.spoil[i].data.worm.y,
          //   { worm: game.spoil[i].data.worm },
          //   3,
          // );
          worm.animation.push({ name: "worm", fromX: worm.x, fromY: worm.y });
          en.move(game, worm, game.spoil[i].x, game.spoil[i].y);
        }
      }
      game.spoil.splice(i, 1);
    }
  }
};

exports.wormportal = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "wormportal" && !en.isAlive(game, game.spoil[i].data.worm))
      game.spoil.splice(i, 1);
  }
};

exports.rockettarget = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "rockettarget") {
      if (game.spoil[i].data.timer == 0) {
        let unit = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y);
        if (en.isAlive(game, game.spoil[i].data.unit) && game.spoil[i].data.unit.tp == "rocket") {
          if (game.spoil[i].data.unit != unit) {
            en.death(game, unit);
            game.trail.push({
              name: "launch",
              x: game.spoil[i].data.unit.x,
              y: game.spoil[i].data.unit.y,
              data: { unit: game.spoil[i].data.unit },
              turn: 0,
            });
            game.trail.push({
              name: "fall",
              x: game.spoil[i].x,
              y: game.spoil[i].y,
              data: { unit: game.spoil[i].data.unit },
              turn: 1,
            });
            en.move(game, game.spoil[i].data.unit, game.spoil[i].x, game.spoil[i].y);
            en.death(game, game.spoil[i].data.unit);
            for (let xx = -1; xx <= 1; xx++) {
              for (let yy = -1; yy <= 1; yy++) {
                if (en.inField(game.spoil[i].x + xx, game.spoil[i].y + yy)) {
                  if (game.field[game.spoil[i].x + xx][game.spoil[i].y + yy] == "grass")
                    game.field[game.spoil[i].x + xx][game.spoil[i].y + yy] = "ground";

                  let poorGuy = en.unitInPoint(game, game.spoil[i].x + xx, game.spoil[i].y + yy);
                  if (poorGuy) {
                    game.trail.push({
                      name: "idle",
                      x: game.spoil[i].x + xx,
                      y: game.spoil[i].y + yy,
                      data: { unit: poorGuy },
                      turn: 0,
                    });
                    game.trail.push({
                      name: "idle",
                      x: game.spoil[i].x + xx,
                      y: game.spoil[i].y + yy,
                      data: { unit: poorGuy },
                      turn: 1,
                    });
                    en.death(game, poorGuy);
                  }
                  let s = en.addSpoil(
                    game,
                    "fire",
                    game.spoil[i].x + xx,
                    game.spoil[i].y + yy,
                    false,
                    3
                  );
                  s.animation.push({ name: "none" });
                  s.animation.push({ name: "none" });
                }
              }
            }
          }
        }
        game.spoil.splice(i, 1);
      } else {
        game.spoil[i].data.timer--;
      }
    }
  }
};
exports.landmine = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "landmine" && game.spoil[i].team == game.turn) {
      en.addUnit(game, "landmine", game.spoil[i].x, game.spoil[i].y, game.spoil[i].team);
      game.spoil.splice(i, 1);
    }
  }
};

exports.fireBurn = (game) => {
  for (let i = game.spoil.length - 1; i >= 0; i--) {
    const spoilItem = game.spoil[i];
    if (spoilItem.name === "fire") {
      // Преобразование "fire" в "fire1"
      spoilItem.name = "fire1";
    } else if (spoilItem.name === "fire1") {
      // Преобразование "fire1" в "fire2"
      spoilItem.name = "fire2";
    } else if (spoilItem.name === "fire2") {
      // Удаление "fire2" из массива
      game.spoil.splice(i, 1);
    }
  }
};

exports.egg = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "egg" && !en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)) {
      // let tp
      // do {
      // 	tp = _.sample(Object.keys(meta));
      // } while (tp == game.spoil[i].data.tp)
      en.addUnit(
        game,
        game.spoil[i].data.tp,
        game.spoil[i].x,
        game.spoil[i].y,
        game.spoil[i].data.team
      );
      // en.addUnit(game, tp, game.spoil[i].x, game.spoil[i].y, game.spoil[i].data.team);
      game.spoil.splice(i, 1);
    }
  }
};

exports.airdropBirth = (game) => {
  for (let i = game.spoil.length - 1; i >= 0; i--) {
    let tp = "mushroom";

    if (
      game.spoil[i].name === "airdrop" &&
      !en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
    ) {
      let u = en.addUnit(game, tp, game.spoil[i].x, game.spoil[i].y, 3);
      // let u = en.addUnit(game, tp, game.spoil[i].x, game.spoil[i].y, game.turn);

      u.animation.push({ name: "add" });
      game.spoil.splice(i, 1);
    }
  }
};

// exports.teamBirth = (game) => {
//   // Retrieve all points on the grid
//   const allPoints = en.allPoints();

//   // Determine the team based on the current turn
//   const targetTeam = `team${game.turn}`;

//   // Filter points where the field matches the target team and is unoccupied
//   let availablePoints = allPoints.filter(
//     (p) => game.field[p.x][p.y] === targetTeam && !en.unitInPoint(game, p.x, p.y)
//   );

//   // If no available points, find nearby unoccupied points first
//   if (availablePoints.length === 0) {
//     let teamPoints = allPoints.filter((p) => game.field[p.x][p.y] === targetTeam);
//     let nearbyPoints = [];
//     teamPoints.forEach((point) => {
//       en.near(point.x, point.y).forEach((pt) => {
//         if (!en.unitInPoint(game, pt.x, pt.y)) {
//           nearbyPoints.push(pt);
//         }
//       });
//     });
//     availablePoints = nearbyPoints;
//   }

//   // Randomly select one of the available points and add a unit
//   if (availablePoints.length > 0) {
//     const selectedPoint = _.sample(availablePoints);
//     let u = en.addUnit(game, "mushroom", selectedPoint.x, selectedPoint.y, game.turn);
//     u.animation.push({ name: "add" });
//   }
// };

// exports.baseRebirth = (game) => {
//   let ulist = game.unit.filter((unit) => unit.team == game.turn);
//   if (ulist.some((unit) => unit.tp === "base")) return;
//   let points = en.freeCells(game);
//   let point = _.sample(points);
//   let u = en.addUnit(game, "base", point.x, point.y, game.turn);
//   u.status.push("teleporter");
// };

exports.basePolymoprh = (game) => {
  let ulist = game.unit.filter((unit) => unit.team == game.turn);
  if (!ulist.some((unit) => unit.tp === "base")) {
    let newBase = _.sample(ulist);
    if (newBase) {
      newBase.tp = "base";
      game.trail.push({ img: "polymorph", x: newBase.x, y: newBase.y });
    }
  }
};

exports.eggcrack = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    let sp = game.spoil[i];
    if (sp.name == "egg") {
      let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y);
      if (u) {
        game.trail.push({ img: "egg", x: game.spoil[i].x, y: game.spoil[i].y });
        game.spoil.splice(i, 1);
      }
    }
  }
};

exports.landmineexplosion = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    let sp = game.spoil[i];
    if (sp.name == "landmine") {
      let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y);
      if (u) {
        en.death(game, u);
        en.addUnit(game, "landmine", game.spoil[i].x, game.spoil[i].y, game.spoil[i].team);
        game.spoil.splice(i, 1);
      }
    }
  }
};

exports.frog = (game) => {
  game.unit.forEach((u) => {
    u.status.remove("frog");
    u.status.remove("frog2");
    if (u.tp == "frog") u.data.lastjump = false;
  });
};
exports.drillgun = (game) => {
  game.unit.forEach((u) => {
    // u.status.remove('frog')
    if (u.tp == "drillgun") u.data.summoned = false;
  });
};
exports.aerostat = (game) => {
  game.unit.forEach((u) => {
    if (u.tp == "aerostat") u.data.drop = false;
  });
};
exports.split = (game, unit) => {
  if (unit && unit.status.includes("spliter")) {
    unit.status.remove("spliter");
    unit.status.push("spliter2");
  }
};
exports.splitOnEndturn = (game) => {
  for (i = game.unit.length; i--; i > 0) {
    let u = game.unit[i];
    if (u.status.includes("spliter2")) {
      en.disappear(game, u);
      game.trail.push({
        name: "death",
        x: u.x,
        y: u.y,
        data: { unit: u },
        turn: 0,
      });
    }
    if (u.status.includes("spliter")) {
      u.status.remove("spliter");
      u.status.push("spliter2");
    }
  }
};

exports.spill = (game) => {
  let ok = true;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      // if (game.leftturns <= 15) {
      //   if (game.field[x][y] == "ground") game.field[x][y] = "water";
      // } else
      if (game.field[x][y] == "water") game.field[x][y] = "ground";
    }
  }
  game.unit.forEach((unit) => {
    if (unit.tp == "fountain")
      if (game.field[unit.x][unit.y] == "ground") game.field[unit.x][unit.y] = "water";
  });
  while (ok) {
    ok = false;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (game.field[x][y] == "ground") {
          en.near(x, y).forEach((p) => {
            if (game.field[p.x][p.y] == "water") {
              game.field[x][y] = "water";
              ok = true;
            }
          });
        }
      }
    }
  }
};
exports.capture = (game) => {
  game.unit.forEach((unit) => {
    if (game.field[unit.x][unit.y] == "team1" && unit.team == 2)
      game.field[unit.x][unit.y] = "team2";
    if (game.field[unit.x][unit.y] == "team2" && unit.team == 1)
      game.field[unit.x][unit.y] = "team1";
  });
};

exports.bomber = (wd) => {
  if (wd.me.status.includes("bomber")) {
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (
          en.inField(wd.target.x + xx, wd.target.y + yy) &&
          wd.game.field[wd.target.x + xx][wd.target.y + yy] == "grass"
        )
          wd.game.field[wd.target.x + xx][wd.target.y + yy] = "ground";
      }
    }
    wd.kill(wd.me.x - 1, wd.me.y - 1);
    wd.spoil("fire", wd.me.x - 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x, wd.me.y - 1);
    wd.spoil("fire", wd.me.x, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y - 1);
    wd.spoil("fire", wd.me.x + 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y);
    wd.spoil("fire", wd.me.x + 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y);
    wd.spoil("fire", wd.me.x - 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y + 1);
    wd.spoil("fire", wd.me.x - 1, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x, wd.me.y + 1);
    wd.spoil("fire", wd.me.x, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y + 1);
    wd.spoil("fire", wd.me.x + 1, wd.me.y + 1, false, 3);
    wd.spoil("fire", wd.me.x, wd.me.y, false, 3);
  }
};

exports.drop = (wd) => {
  if (wd.me.sticker) {
    en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3);
  }
};

exports.slime = (game) => {
  game.unit.forEach((u) => {
    u.status.remove("slime");
    u.status.remove("openslime");
  });

  let slimes = game.unit.filter((u) => u.tp == "slime");

  slimes.forEach((slime) => {
    let marks = new Map();
    marks.set(slime.x + "_" + slime.y, { x: slime.x, y: slime.y });
    let nw = true;
    while (nw) {
      nw = false;
      game.unit.forEach((u) => {
        let npt = en.near(u.x, u.y);
        npt.forEach((n) => {
          if (marks.get(n.x + "_" + n.y)) {
            if (!marks.get(u.x + "_" + u.y)) {
              marks.set(u.x + "_" + u.y, { x: u.x, y: u.y });
              nw = true;
            }
          }
        });
      });
    }
    marks.forEach((v, k, m) => {
      let u = en.unitInPoint(game, v.x, v.y);
      if (u.tp != "slime" && slime.team != u.team)
        en.addStatus(en.unitInPoint(game, v.x, v.y), "slime");
      else if (u.tp != "slime" && slime.team == u.team)
        en.addStatus(en.unitInPoint(game, v.x, v.y), "openslime");
    });
  });
};

exports.lover = (game) => {
  let lover = false;
  game.unit.forEach((u) => {
    if (u.tp == "lover") lover = true;
  });
  if (!lover)
    for (i = game.unit.length; i--; i > 0) {
      if (game.unit[i].status.includes("love")) {
        en.death(game, game.unit[i]);
      }
    }
};
exports.staziser = (game) => {
  let olddata;
  let staziser = 0;
  game.unit.forEach((u) => {
    if (u.tp == "staziser") {
      staziser++;
      olddata = u.data.staziser;
    }
  });
  if (staziser == 0 || (olddata && olddata > staziser))
    for (i = game.unit.length; i--; i > 0) {
      game.unit[i].status.remove("stazis");
    }
  game.unit.forEach((u) => {
    if (u.tp == "staziser") u.data.staziser = staziser;
  });
};

exports.drill = (game) => {
  game.unit.forEach((u) => {
    if (u.tp == "drill" && u.data.dir) {
      let tu = en.unitInPoint(game, u.x + u.data.dir.x, u.y + u.data.dir.y);
      if (tu) en.death(game, tu);
      en.move(game, u, u.x + u.data.dir.x, u.y + u.data.dir.y);
    }
  });
};

exports.hoplite = (game) => {
  for (i = game.spoil.length; i--; i > 0) {
    let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y);
    if (u && game.spoil[i].name == "spear" && u.tp == "hoplite") {
      // if (u.data.spear)
      game.spoil.splice(i, 1);
      u.data.spear = false;
    }
  }
};

exports.airdrop = (game) => {
  // Retrieve all points on the grid
  const allPoints = en.allPoints();

  let points = allPoints.filter((p) => game.field[p.x][p.y].slice(0, -1) != "team");

  // Function to find the minimum Manhattan distance from a point to a set of points
  const minDistanceToPoints = (point, points) => {
    let minDist = Infinity;
    points.forEach((pt) => {
      const dist = en.distance(point.x, point.y, pt.x, pt.y);
      if (dist < minDist) {
        minDist = dist;
      }
    });
    return minDist;
  };

  // Combine the list of units and spoils into a single array
  const combinedPoints = game.unit.concat(game.spoil.filter((s) => s.name === "airdrop"));

  // Find the point with the maximum minimum distance to all combined points
  let maxDistance = 0;
  let bestPoints = [];
  points.forEach((point) => {
    const dist = minDistanceToPoints(point, combinedPoints);
    if (dist > maxDistance) {
      maxDistance = dist;
      bestPoints = [point];
    } else if (dist === maxDistance) {
      bestPoints.push(point);
    }
  });

  // Randomly select one of the best points and add a spoil
  if (bestPoints.length > 0) {
    const selectedPoint = _.sample(bestPoints);
    en.addSpoil(game, "airdrop", selectedPoint.x, selectedPoint.y, false, 3);
  }
};

exports.flagwin = (game) => {
  let flag = [0, 0];
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (game.field[x][y] == "team1") {
        flag[0]++;
      }
      if (game.field[x][y] == "team2") {
        flag[1]++;
      }
    }
  }
  if (flag[0] == 0 && game.turn == 2) {
    gm.endgame(game, 2);
  } else if (flag[1] == 0 && game.turn == 1) {
    gm.endgame(game, 1);
  }
};

exports.genocide = (game) => {
  //закончилисиь юниты
  let team1isAlive = game.unit.some((unit) => unit.team === 1);
  let team2isAlive = game.unit.some((unit) => unit.team === 2);
  if (team1isAlive && !team2isAlive) gm.endgame(game, 1);
  if (team2isAlive && !team1isAlive) gm.endgame(game, 2);
  if (!team1isAlive && !team2isAlive) game.leftturns = 0;
};
