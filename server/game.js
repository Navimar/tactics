const meta = require('./meta');
const wrapper = require('./wrapper');
const send = require('./send');
const en = require('./engine');
const generator = require('./generator');

exports.new = (p1, p2) => {
  let game = {
    // key: newKey(),
    players: [p1, p2],
    data: generator.new(),
    turn: 1,
    winner: 0,
    leftturns: 14,
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

  let unit = en.unitInPoint(game, u.x, u.y);
  game.data.unit.forEach(u => {
    // console.log(u.energy,u.isReady)
    u.isActive = false;
    if (u.energy < 3 && u != unit) u.isReady = false;
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
  game.data.unit.forEach(u => {
    u.energy = 3;
    u.isReady = true;
  });

  game.turn = game.turn == 1 ? 2 : 1;
  game.leftturns--;
  if (game.leftturns == 0) {
    let flag1 = 0
    let flag2 = 0;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (game.data.field[x][y] == 'team1')
          flag1++;
        if (game.data.field[x][y] == 'team2')
          flag2++
      }
    }
    if (flag1 > flag2) {
      game.winner = 1
    } else {
      game.winner = 2
    }
  }
  send.data(game);
}