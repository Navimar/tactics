const meta = require('./meta');
const time = require('./time');
const wrapper = require('./wrapper');
const send = require('./send');
const en = require('./engine');
const generator = require('./generator');

const _ = require('lodash');


exports.new = (p1, p2) => {
  let data = generator.new();
  let game = {
    players: [p1, p2],
    fisher: ['', ''],
    trail: [],
    lastturntime: [],
    bonus: [null, null],
    unit: data.unit,
    field: data.field,
    turn: 1,
    winner: 0,
    leftturns: 16,
    started: time.clock(),
    destraction: 0,
    finshed:false,
  }
  p1.game = game;
  p2.game = game;
  return game;
}

exports.order = (p, u, akt) => {
  //проверка корректный ли юнит и акт добавить в будущем, чтобы клиент не могу уронить сервер или сжулиьничать
  let game = p.game;
  if (game &&!game.finshed) {
    fisher(game);
    game.trail = [];
    let unit = en.unitInPoint(game, u.x, u.y);
    if (unit) {

      addbonus(game, unit)

      game.unit.forEach(u => {
        // console.log(u.energy,u.isReady)
        u.isActive = false;
        if (u.energy < 3 && u != unit) {
          if (_.isFunction(meta[u.tp].onTire)) {
            // console.log('isFunction');
            meta[u.tp].onTire(wrapper(game, u, { x: u.x, y: u.y, unit: u }));
          }
          wrapper(game, u, { x: u.x, y: u.y, unit: u }).tire();
        }
      });
      unit.isActive = true;
      if (unit.x - akt.x > 0) {
        unit.m = true;
      } else if (unit.x - akt.x < 0) {
        unit.m = false;
      }
      meta[unit.tp][akt.img](wrapper(game, unit, { x: akt.x, y: akt.y, unit: en.unitInPoint(game, akt.x, akt.y) }));
      send.data(game);
    }
  }
}

exports.endturn = (p) => {
  let game = p.game;
  if (game && !game.finshed) {
    destraction(game);
    game.unit.forEach(u => {
      if (_.isFunction(meta[u.tp].onEndturn)) {
        // console.log('isFunction');
        meta[u.tp].onEndturn(wrapper(game, u, { x: u.x, y: u.y, unit: u }));
      }
      u.energy = 3;
      u.isReady = true;
    });

    game.leftturns--;
    if (game.leftturns == 0) {
      let flag1 = 0
      let flag2 = 0;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (game.field[x][y] == 'team1')
            flag1++;
          if (game.field[x][y] == 'team2')
            flag2++
        }
      }
      if (flag1 > flag2) {
        game.winner = 1
      } else {
        game.winner = 2
      }
    } else {
      if (game.fisher[game.turn - 1] < 0) {
        game.winner = game.turn == 1 ? 2 : 1;
      } else {
        game.fisher[game.turn - 1] += 120;
      }
    }
    game.turn = game.turn == 1 ? 2 : 1;
    fisher(game)
    send.data(game);
  }
}

exports.setbonus = (p, bonus) => {
  let game = p.game;
  game.bonus[game.turn - 1] = bonus;
  if (game.bonus[0] !== null && game.bonus[1] !== null) {
    if (game.bonus[0] < game.bonus[1]) {
      game.bonus[0] = 0;
      game.turn = game.turn == 1 ? 2 : 1;
    } else {
      game.bonus[1] = 0;
    }
    game.chooseteam = true;
  }
  game.turn = game.turn == 1 ? 2 : 1;
  send.data(game);
}
function addbonus(game, unit) {
  let turn = game.turn == 1 ? 1 : 0;
  if (game.bonus[turn]) {
    unit.life += game.bonus[turn];
    game.bonus[turn] = 0;
  }
  if (unit.team !== game.turn) {
    game.unit.forEach(u => {
      if (u.team == 1) { u.team = 2; } else
        if (u.team == 2) u.team = 1;
    });
  }
  game.chooseteam = false;
}

let fisher = (game) => {
  if (!game.lastturntime[game.turn - 1]) {
    game.lastturntime[game.turn - 1] = time.clock();
    game.fisher[game.turn - 1] = 120;
  }
  game.fisher[game.turn - 1] -= time.clock() - game.lastturntime[game.turn - 1];
  game.lastturntime[game.turn - 1] = time.clock();

  // console.log(game.fisher)

}

let destraction = (game) => {
  let des = game.destraction % 4
  console.log('des', des)
  let d = 0
  if (game.destraction)
    d = (game.destraction - des) / 4;
  console.log('d', d)

  if (des == 0) {
    for (let x = 0; x < 9; x++) {
      for (let y = 0 + d; y < 1 + d; y++) {
        game.field[x][y] = 'outland';
      }
    }
  }
  else if (des == 1) {
    for (let x = 8 - d; x < 9 - d; x++) {
      for (let y = 0; y < 9; y++) {
        game.field[x][y] = 'outland';
      }
    }
  }
  else if (des == 2) {
    for (let x = 0; x < 9; x++) {
      for (let y = 8 - d; y < 9 - d; y++) {
        game.field[x][y] = 'outland';
      }
    }
  }
  else if (des == 3) {
    for (let x = 0 + d; x < 1 + d; x++) {
      for (let y = 0; y < 9; y++) {
        game.field[x][y] = 'outland';
      }
    }
  }
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (game.field[x][y] == 'outland') {
        let u = en.unitInPoint(game, x, y)
        if (u)
          en.death(game, u);
      }
    }
  }
  game.destraction++
  if (game.destraction > 15) game.finshed = true;
}