const meta = require('./meta');
const time = require('./time');
const wrapper = require('./wrapper');
const send = require('./send');
const en = require('./engine');
const player = require('./player');
const generator = require('./generator');
const onOrder = require('./onOrder');
const onTire = require('./onTire');
const onEndTurn = require('./onEndTurn');
const _ = require('lodash');


exports.new = (p1, p2) => {
  let game = creategame(p1, p2)
  p1.game = game;
  p1.number = 1
  p2.game = game;
  p2.number = 2
  return game;
}
let creategame = (p1, p2) => {
  let data = generator.new();
  let game = {
    players: [p1, p2],
    fisher: [120, 120],
    trail: [],
    lastturntime: [],
    bonus: [null, p2.rank, p1.rank],
    unit: data.unit,
    field: data.field,
    turn: (() => {
      if (p1.rank > p2.rank)
        return 2
      else return 1
    })(),
    winner: 0,
    leftturns: 14,
    started: time.clock(),
    sticker: [],
    finished: false,
    chooseteam: true,
    end: (pn) => {
      if (!game.sandbox) {
        pn--;
        if (pn == 0) player.wins(p1, p2)
        if (pn == 1) player.wins(p2, p1)
      }
    }
  }
  return game;
}
exports.order = (game, p, u, akt) => {
  //проверка корректный ли юнит и акт добавить в будущем, чтобы клиент не мог уронить сервер или сжулиьничать
  if (game && !game.finished) {
    fisher(game);
    game.trail = [];
    let unit = en.unitInPoint(game, u.x, u.y);
    if (unit) {

      if (game.chooseteam) addbonus(game, unit)

      game.unit.forEach(u => {
        // console.log(u.energy,u.isReady)
        u.isActive = false;
        if (u.energy < 3 && u != unit && u.isReady) {
          wrapper(game, u, { x: u.x, y: u.y, unit: u }).tire();
          onTire.frog(game);

        }
      });
      unit.isActive = true;
      if (unit.x - akt.x > 0) {
        unit.m = true;
      } else if (unit.x - akt.x < 0) {
        unit.m = false;
      }
      meta[unit.tp][akt.img](wrapper(game, unit, { x: akt.x, y: akt.y, unit: en.unitInPoint(game, akt.x, akt.y) }));

      onOrder.slime(game);
      onOrder.capture(game);

      send.data(game);
    }
  }
}
exports.surrender = (game, p) => {
  if (game && !game.finished) {
    game.finished = true
    if (p == 1) {
      game.winner = 2;
      game.end(2);
    }
    else {
      game.winner = 1;
      game.end(1);
    }
    send.data(game);
  }
}

exports.rematch = (p) => {
  // console.log('rematch')
  let sandbox = p.game.sandbox;
  let p1 = p.game.players[0];
  let p2 = p.game.players[1];
  let game = creategame(p1, p2)
  game.sandbox = sandbox;
  p1.game = game;
  p1.number = 1
  p2.game = game;
  p2.number = 2
  send.data(game);
}


exports.endturn = (game, p) => {

  function cnFlag() {
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
      game.end(1);
    } else {
      game.winner = 2
      game.end(2);
    }
    game.finished = true
  }
  if (game && !game.finished) {
    let one, two
    game.unit.forEach(u => {
      // if (_.isFunction(meta[u.tp].onEndturn)) {
      //   // console.log('isFunction');
      //   meta[u.tp].onEndturn(wrapper(game, u, { x: u.x, y: u.y, unit: u }));
      // }
      // if (u.status && _.isFunction(status[u.status].onEndturn)) {
      //   status[u.status].onEndturn(wrapper(game, u, { x: u.x, y: u.y, unit: u }));
      // }
      u.energy = 3;
      u.isReady = true;
      if (u.team == 1) {
        one = true;
      }
      if (u.team == 2) {
        two = true;
      }
    });
    if (!one && two) {
      game.winner = 2
      game.finished = true
      game.end(2);
    }
    if (one && !two) {
      game.finished = true
      game.winner = 1;
      game.end(1);
    }
    if (!one && !two) {
      cnFlag();
    }

    game.leftturns--;
    if (game.leftturns == 0) {
      cnFlag();
    } else {
      if (game.fisher[game.turn - 1] < 0) {
        // game.winner = game.turn == 1 ? 2 : 1;
        game.fisher[game.turn - 1] += 120;
      } else {
        game.fisher[game.turn - 1] += 120;
      }
    }
    game.turn = game.turn == 1 ? 2 : 1;
    fisher(game)

    onEndTurn.telepath(game);
    onEndTurn.frog(game);

    send.data(game);
  }
}

exports.setbonus = (game, p, bonus) => {
  game.bonus[3 - p] = bonus;
  if (game.sandbox) {
    game.bonus[1] = bonus;
    game.bonus[2] = bonus;
  }
  if (game.bonus[1] !== null && game.bonus[2] !== null) {
    if (game.bonus[1] < game.bonus[2]) {
      game.bonus[1] = 0;
      game.turn = 1;
    } else {
      game.bonus[2] = 0;
      game.turn = 2;
    }
    game.chooseteam = true;
  }
  // else {
  //   game.turn = game.turn == 1 ? 2 : 1;
  // }
  send.data(game);
}
function addbonus(game, unit) {
  // console.log(game.bonus[game.turn])
  if (unit.team !== game.turn) {
    game.unit.forEach(u => {
      if (u.team == 1) { u.team = 2; } else
        if (u.team == 2) u.team = 1;
    });
  }
  if (game.bonus[3 - game.turn]) {
    while (game.bonus[3 - game.turn] > 0) {
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          let u = en.unitInPoint(game, x, y);
          if (u && game.bonus[3 - game.turn] > 0 && u.team != 3 && u.team != game.turn) {
            u.life++ , game.bonus[3 - game.turn]--
          }
        }
      }
    }
    game.bonus[game.turn] = 0;
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

// let destraction = (game) => {
//   let land = 'water'
//   let des = game.destraction % 4
//   // console.log('des', des)
//   let d = 0
//   if (game.destraction)
//     d = (game.destraction - des) / 4;
//   // console.log('d', d)

//   if (des == 0) {
//     for (let x = 0; x < 9; x++) {
//       for (let y = 0 + d; y < 1 + d; y++) {
//         game.field[x][y] = land;
//       }
//     }
//   }
//   else if (des == 1) {
//     for (let x = 8 - d; x < 9 - d; x++) {
//       for (let y = 0; y < 9; y++) {
//         game.field[x][y] = land;
//       }
//     }
//   }
//   else if (des == 2) {
//     for (let x = 0; x < 9; x++) {
//       for (let y = 8 - d; y < 9 - d; y++) {
//         game.field[x][y] = land;
//       }
//     }
//   }
//   else if (des == 3) {
//     for (let x = 0 + d; x < 1 + d; x++) {
//       for (let y = 0; y < 9; y++) {
//         game.field[x][y] = land;
//       }
//     }
//   }
//   game.destraction++
//   if (game.destraction > 15) game.finished = true;
// }