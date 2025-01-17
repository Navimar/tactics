const meta = require("./meta");

let en = {};
en.near = (x, y) => {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].filter((pt) => pt.x <= 8 && pt.x >= 0 && pt.y >= 0 && pt.y <= 8);
};
en.near9 = (x, y) => {
  return [
    { x, y },
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
  ].filter((pt) => pt.x <= 8 && pt.x >= 0 && pt.y >= 0 && pt.y <= 8);
};
en.distance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

en.allPoints = () => {
  let points = [];
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y });
    }
  }
  return points;
};

en.freeCells = (game) => {
  return en.allPoints().filter((point) => !en.isOccupied(game, point.x, point.y));
};

en.occupiedCells = (game) => {
  return en.allPoints().filter((point) => en.isOccupied(game, point.x, point.y));
};

en.isFlag = (game, x, y) => {
  return game.field[x][y].slice(0, -1) == "team";
};

en.inField = (x, y) => {
  if (x >= 0 && x < 9 && y < 9 && y >= 0) return true;
};

en.oppositeTeam = (team) => {
  let t = team;
  if (t != 3) t = 3 - t;
  return t;
};

en.isNear4 = (x1, y1, x2, y2) => {
  let dx = Math.abs(x1 - x2);
  let dy = Math.abs(y1 - y2);
  if (dx <= 1 && dy <= 1 && dy + dx == 1) return true;
};

en.isOccupied = (game, x, y) => {
  if (en.inField(x, y)) {
    return game.unit.filter((u) => u.x == x && u.y == y).length;
  } else {
    return -1;
  }
};

en.unitInPoint = (game, x, y) => {
  return game.unit.filter((u) => u.x == x && u.y == y)[0];
};
en.spoilInPoint = (game, x, y) => {
  return game.spoil.filter((u) => u.x == x && u.y == y);
};
en.fieldInPoint = (game, x, y) => {
  return game.field[x][y];
};
en.death = (game, unit) => {
  if (unit) {
    game.deadPool.push(unit);
    game.unit.splice(game.unit.indexOf(unit), 1);
  }
};
en.disappear = (game, unit) => {
  if (unit) {
    if (meta[unit.tp].onDisappear) game.deadPool.push(unit);
    game.unit.splice(game.unit.indexOf(unit), 1);
  }
};

en.addUnit = (game, tp, x, y, team) => {
  if (!en.isOccupied(game, x, y)) {
    let u = en.makeUnit(tp, x, y, team);
    game.unit.push(u);
    game.appearPool.push(u);
    return u;
  }
};
en.addSpoil = (game, name, x, y, data, team) => {
  const spoil = { name, data, x, y, team, animation: [] };
  game.spoil.push(spoil);
  return spoil;
};

en.makeUnit = (tp, x, y, team) => {
  let m = x < 5 ? false : true;
  return {
    status: [],
    akt: [],
    isReady: true,
    energy: meta[tp].maxenergy || 3,
    tp,
    m,
    x,
    y,
    data: {},
    team,
    animation: [],
  };
};

en.isAlive = (game, unit) => {
  if (game.unit.indexOf(unit) >= 0) return true;
};
en.move = (game, unit, x, y) => {
  if (unit) {
    if (en.inField(x, y)) {
      if (!en.unitInPoint(game, x, y)) {
        unit.x = x;
        unit.y = y;
      } else {
        require("./send").logicerror(game, "move cell is busy " + unit.x + " " + unit.y);
      }
    } else {
      en.disappear(game, unit);
    }
  } else {
    require("./send").logicerror(game, "move cant find the unit");
  }
};

en.addStatus = (unit, st) => {
  if (unit) {
    unit.status.push(st);
  }
};

module.exports = en;
