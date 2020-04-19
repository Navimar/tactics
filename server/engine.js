let en = {};
en.near = (x, y) => {
  return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(pt => pt.x <= 8 && pt.x >= 0 && pt.y >= 0 && pt.y <= 8)
}

en.allPoints = () => {
  let points = []
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y });
    }
  }
  return points;
}

en.inField = (x, y) => {
  if (x >= 0 && x < 9 && y < 9 && y >= 0) return true
}

en.isOccupied = (game, x, y) => {
  if (en.inField(x, y)) {
    return game.unit.filter(u => u.x == x && u.y == y).length;
  } else {
    return -1
  }
}

en.unitInPoint = (game, x, y) => {
  return game.unit.filter(u => u.x == x && u.y == y)[0];
}
en.fieldInPoint = (game, x, y) => {
  return game.field[x][y]
}
en.death = (game, unit) => {
  if (unit) {
    game.trail.push({ img: 'damage', x: unit.x, y: unit.y });

    game.unit.splice(game.unit.indexOf(unit), 1);
  }
}

en.addUnit = (game, tp, x, y, team, life) => {
  let u = en.makeUnit(tp, x, y, team, life)
  game.unit.push(u); return u;
}
en.addSpoil = (game, name, x, y, data, team) => {
  game.spoil.push({ name, data, x, y, team })
}

en.makeUnit = (tp, x, y, team, life) => {
  let m = x < 5 ? false : true;
  return {
    status: [],
    akt: [],
    isReady: true,
    energy: 3,
    tp,
    m,
    x,
    y,
    data: {},
    team,
    life,
  }
}
en.damage = (game, unit, d) => {
  if (unit) {
    if (d) { unit.life -= d } else {
      unit.life--;
    }
    // if (unit.life <= 0) en.death(game, unit);
    game.trail.push({ img: 'damage', x: unit.x, y: unit.y });
  } else {
    // require('./send').logicerror(game, 'damage cant find the unit')
  }
}

en.move = (game, unit, x, y) => {
  if (unit) {
    game.trail.push({ img: 'move', x: unit.x, y: unit.y });
    if (x >= 0 && x < 9 && y < 9 && y >= 0) {
      if (!en.unitInPoint(game, x, y)) {
        unit.x = x
        unit.y = y
      } else {
        require('./send').logicerror(game, 'move cell is busy')
      }
    } else {
      en.death(game, unit);
    }
  } else {
    require('./send').logicerror(game, 'move cant find the unit')
  }
}
en.addStatus = (unit, st) => {
  if (unit) {
    unit.status.push(st)
  }
}
// en.makemark = (game, img, x, y) => {
//   game.mark.push({ img, x, y })
// }
module.exports = en;