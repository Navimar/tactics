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
    // key: newKey(),
    players: [p1, p2],
    fisher: [120, 120],
    trail:[],
    lastturntime: [],
    unit: data.unit,
    field: data.field,
    turn: 1,
    winner: 0,
    leftturns: 14,
    started: time.clock(),
  }
  p1.game = game;
  p2.game = game;
  return game;
}

exports.order = (p, u, akt) => {
  //проверка корректный ли юнит и акт добавить в будущем, чтобы клиент не могу уронить сервер или сжулиьничать
  let game = p.game;
  // console.log('order');
  // console.log(u.x, akt)
  game.trail = [];
  let unit = en.unitInPoint(game, u.x, u.y);
  game.unit.forEach(u => {
    // console.log(u.energy,u.isReady)
    u.isActive = false;
    if (u.energy < 3 && u != unit) {
      if (_.isFunction(meta[u.tp].onTire)) {
        // console.log('isFunction');
        meta[u.tp].onTire(wrapper(game, u));
      }
      wrapper(game, u).tire();
    }
  });
  unit.isActive = true;
  if (unit.x - akt.x > 0) {
    unit.m = true;
  } else if (unit.x - akt.x < 0) {
    unit.m = false;
  }
  meta[unit.tp][akt.img](wrapper(game, unit, { x: akt.x, y: akt.y }));
  send.data(game);
}

exports.endturn = (p) => {
  let game = p.game;
  game.unit.forEach(u => {
    if (_.isFunction(meta[u.tp].onEndturn)) {
      // console.log('isFunction');
      meta[u.tp].onEndturn(wrapper(game, u));
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
    if (!game.lastturntime[game.turn-1]) game.lastturntime[game.turn-1] = time.clock();
    game.fisher[game.turn-1] -= game.lastturntime[game.turn-1] - game.started;
    game.lastturntime[game.turn-1] = time.clock();
    if (game.fisher[game.turn-1] < 0) {
      game.winner = game.turn == 1 ? 2 : 1;
    } else {
      game.fisher[game.turn-1] += 120;
    }
  }
  game.turn = game.turn == 1 ? 2 : 1;
  send.data(game);
}

function updatefisher(game) {

}