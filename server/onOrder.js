const en = require('./engine');
const _ = require('lodash');


exports.spill = (game) => {
  let ok = true;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (game.field[x][y] == 'water')
        game.field[x][y] = 'ground'
    }
  }
  game.unit.forEach((unit) => {
    if (unit.tp == 'fountain') if (game.field[unit.x][unit.y] == 'ground') game.field[unit.x][unit.y] = 'water';
  });
  while (ok) {
    ok = false;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (game.field[x][y] == 'ground') {
          en.near(x, y).forEach((p) => {
            if (game.field[p.x][p.y] == 'water') {
              game.field[x][y] = 'water'
              ok = true;
            }
          });
        }
      }
    }
  }
}
exports.capture = (game) => {
  game.unit.forEach((unit) => {
    if (game.field[unit.x][unit.y] == 'team1' && unit.team == 2) game.field[unit.x][unit.y] = 'team2';
    if (game.field[unit.x][unit.y] == 'team2' && unit.team == 1) game.field[unit.x][unit.y] = 'team1';
  });
}

exports.slime = (game) => {
  game.unit.forEach((u) => {
    u.status.remove('slime')
  });

  let slimes = game.unit.filter(u => u.tp == 'slime');

  slimes.forEach(slime => {
    let marks = new Map();
    marks.set(slime.x + '_' + slime.y, { x: slime.x, y: slime.y });
    let nw = true;
    while (nw) {
      nw = false;
      game.unit.forEach((u) => {
        let npt = en.near(u.x, u.y)
        npt.forEach((n) => {
          if (marks.get(n.x + '_' + n.y)) {
            if (!marks.get(u.x + '_' + u.y)) {
              marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
              nw = true;
            }
          }
        });
      });
    }
    marks.forEach((v, k, m) => {
      let u = en.unitInPoint(game, v.x, v.y)
      if (!(u.tp == 'slime' && slime.team == u.team))
        en.addStatus(en.unitInPoint(game, v.x, v.y), 'slime');
    });
  });
}