let en = {};
en.near = (x, y) => {
  return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(pt => pt.x <= 8 && pt.x >= 0 && pt.y >= 0 && pt.y <= 8)
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

en.death = (game, unit) => {
  game.unit.splice(game.unit.indexOf(unit), 1);
}

en.damage = (game, unit) => {
  if (unit) {
    unit.life--;
    if (unit.life <= 0) en.death(game, unit);
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

module.exports = en;