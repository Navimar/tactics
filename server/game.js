const meta = require('./meta');
const action = require('./action');
const time = require('./time');
const wrapper = require('./wrapper');
const akter = require('./akter');
const send = require('./send');
const en = require('./engine');
const player = require('./player');
const generator = require('./generator');
const onOrder = require('./onOrder');
const onAkt = require('./onAkt');
const rules = require('./rules');
const _ = require('lodash');
const bot = require('./bot');

let games = []
let lastid = 0;
exports.games = () => {
  return games
}

exports.new = (p1, p2) => {
  let game = creategame(p1, p2, lastid++)
  games.push(game);
  return game
}

let creategame = (p1, p2, id) => {
  let sandbox = false
  if (p1 == p2)
    sandbox = true
  let data = generator.new(Math.min(p1.rank, p2.rank));
  let game = {
    players: [p1, p2],
    fisher: [120, 120],
    gold: [0, 0],
    trail: [],
    lastturntime: [],
    // bonus: [null, p2.rank, p1.rank],
    bonus: [null, null, null],
    unit: data.unit,
    deadPool: [],
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
    spoil: [],
    finished: false,
    chooseteam: true,
    id,
    sandbox,
    destroy: () => {
      for (i = p1.game.length; i--; i > 0) {
        if (p1.game.id == this.id)
          p1.game.splice(i, 1);
      }
      for (i = p2.game.length; i--; i > 0) {
        if (p2.game.id == this.id)
          p2.game.splice(i, 1);
      }
    },
  }
  // chooseteam: false,
  return game;
}
exports.order = (game, u, akt) => {
  //проверка корректный ли юнит и акт добавить в будущем, чтобы клиент не мог уронить сервер или сжулиьничать
  if (game && !game.finished) {
    fisher(game);
    game.trail = [];
    let unit = en.unitInPoint(game, u.x, u.y);
    if (akt.img == 'build') {
      // console.log('build')
      let newu = en.addUnit(game, u, akt.x, akt.y, game.turn)
      newu.isReady = false;
      game.gold[game.turn - 1] -= 5;
      game.unit.forEach(u => {
        if (u.energy < 3 && u.isReady) {
          wrapper(game, u, { x: u.x, y: u.y, unit: u }).tire();
          //onTire
          rules.frog(game);
          rules.aerostat(game);
        }
      });
    } else {
      if (unit) {
        if (game.chooseteam) addbonus(game, unit)

        game.unit.forEach(u => {
          u.isActive = false;
          if (u.energy < 3 && u != unit && u.isReady) {
            wrapper(game, u, { x: u.x, y: u.y, unit: u }).tire();
            //onTire
            rules.frog(game);
            rules.aerostat(game);
          }
        });
        unit.isActive = true;
        if (unit.x - akt.x > 0) {
          unit.m = true;
        } else if (unit.x - akt.x < 0) {
          unit.m = false;
        }
        if (_.isFunction(meta[unit.tp][akt.img])) {
          meta[unit.tp][akt.img](wrapper(game, unit, { x: akt.x, y: akt.y, unit: en.unitInPoint(game, akt.x, akt.y) }), akt.data);
      }
        else
          action[akt.img](wrapper(game, unit, { x: akt.x, y: akt.y, unit: en.unitInPoint(game, akt.x, akt.y) }), akt.data);
      }
    }
    //onOrder
    onOrder(game, unit,akt);

    updateAkts(game);
    send.data(game);

  }
}
let updateAkts = (game) => {
  let id = 0;
  game.unit.forEach(u => {
    u.akt = [];
    if (u.isReady) {
      u.akt = meta[u.tp].akt(akter(game, u));
      u.akt.forEach(uakt => {
        uakt.id = id++;
      });
    }
    onAkt.telepath(game, u);
    onAkt.worm(game, u)
    onAkt.slime(game, u);
    onAkt.stazis(game, u);
    onAkt.teleporter(game, u);
  });
}
let endgame = (game, winner) => {
  game.finished = true;
  game.winner = winner;
  let words = ['Вы победили.', 'Вы проиграли.']
  if (winner == 2)
    words = words.reverse()
  if (!game.sandbox) {
    let dif0 = game.players[0].rank
    let dif1 = game.players[1].rank
    let pn = winner - 1;
    if (pn == 0) player.wins(game.players[0], game.players[1])
    if (pn == 1) player.wins(game.players[1], game.players[0])
    dif0 = game.players[0].rank - dif0
    dif1 = game.players[1].rank - dif1
    if (dif0 > 0) dif0 = '+' + dif0
    if (dif1 > 0) dif1 = '+' + dif1
    send.bot(game.players[0].id, words[0] + ' Ваш ранг теперь: ' + game.players[0].rank + ' (' + dif0 + ')', bot);
    send.bot(game.players[1].id, words[1] + ' Ваш ранг теперь: ' + game.players[1].rank + ' (' + dif1 + ')', bot);
  }
  player.clear(game.players[0], game.id)
  player.clear(game.players[1], game.id)


}
exports.surrender = (game, p) => {
  if (game && !game.finished) {
    if (p == 1) {
      endgame(game, 2);
    }
    else {
      endgame(game, 1);
    }
    updateAkts(game);
    send.data(game);
  }
}

exports.rematch = (gm) => {
  ng = creategame(gm.players[0], gm.players[1], gm.id)
  for (i in games)
    if (games[i] == gm)
      games[i] = ng
  send.data(ng);
}

exports.endturn = (game, p) => {
  function cnFlag() {
    let flag = [0, 0]
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (game.field[x][y] == 'team1') {
          if (game.turn - 1 == 0)
            game.trail.push({ img: 'gold', x, y });
          flag[0]++
        }
        if (game.field[x][y] == 'team2') {
          if (game.turn - 1 == 1)
            game.trail.push({ img: 'gold', x, y });
          flag[1]++
        }
      }
    }
    game.gold[game.turn - 1] += flag[game.turn - 1];
    return flag
  }

  if (game && !game.finished) {
    let one, two
    game.unit.forEach(u => {
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
      endgame(game, 2);
    }
    if (one && !two) {
      endgame(game, 1);
    }
    if (!one && !two) {
      let flag = cnFlag();
      if (flag[0] > flag[1]) {
        endgame(game, 1);
      } else {
        endgame(game, 2);
      }
    }

    game.leftturns--;
    if (game.leftturns == 0) {
      let flag = cnFlag();
      if (flag[0] > flag[1]) {
        endgame(game, 1);
      } else {
        endgame(game, 2);
      }
    } else {
      if (game.fisher[game.turn - 1] < 0) {
        // game.winner = game.turn == 1 ? 2 : 1;
        game.fisher[game.turn - 1] += 120;
      } else {
        game.fisher[game.turn - 1] += 120;
      }
    }
    cnFlag()
    game.turn = game.turn == 1 ? 2 : 1;
    fisher(game)

    //onEndTurn
    rules.telepath(game);
    rules.frog(game);
    rules.drillgun(game);
    rules.aerostat(game);
    rules.landmine(game);
    rules.egg(game);
    rules.rockettarget(game);
    rules.worm(game);
    rules.firestt(game);
    rules.splitOnEndturn(game)
    rules.drill(game)

    onOrder(game);

    updateAkts(game);
    send.data(game);

    if (!game.sandbox)
      send.bot(game.players[game.turn - 1].id, 'Ваш ход!\nЕсли потеряли ссылку на игру вызовите команду /play', bot);
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
  updateAkts(game);
  send.data(game);
}
function addbonus(game, unit) {
  if (unit.team !== game.turn) {
    game.unit.forEach(u => {
      if (u.team == 1) { u.team = 2; } else
        if (u.team == 2) u.team = 1;
    });
  }
  game.gold[0] = game.bonus[1]
  game.gold[1] = game.bonus[2]
  // if (game.bonus[3 - game.turn]) {
  //   while (game.bonus[3 - game.turn] > 0) {
  //     for (let x = 0; x < 9; x++) {
  //       for (let y = 0; y < 9; y++) {
  //         let u = en.unitInPoint(game, x, y);
  //         if (u && game.bonus[3 - game.turn] > 0 && u.team != 3 && u.team != game.turn) {
  //           u.life++ , game.bonus[3 - game.turn]--
  //         }
  //       }
  //     }
  //   }
  //   game.bonus[game.turn] = 0;
  // }
  game.chooseteam = false;
}

let fisher = (game) => {
  if (!game.lastturntime[game.turn - 1]) {
    game.lastturntime[game.turn - 1] = time.clock();
    game.fisher[game.turn - 1] = 120;
  }
  game.fisher[game.turn - 1] -= time.clock() - game.lastturntime[game.turn - 1];
  game.lastturntime[game.turn - 1] = time.clock();

}

exports.byId = (id) => {
  let g = games.find((e) => {
    return e.id == id
  });
  if (g == undefined) g = false
  return g
}