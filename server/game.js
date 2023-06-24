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
const ai = require('./ai');

let games = []
let lastid = 0;
exports.games = () => {
  return games
}

exports.new = (p1, p2, ai) => {
  let game = creategame(p1, p2, lastid++, ai)
  games.push(game);
  return game
}

let creategame = (p1, p2, id, ai) => {
  let leftturns = 30
  let chooseteam = true;
  let turn = p1.rank > p2.rank ? 2 : 1
  let sandbox = false
  let bonus = [null, null, null]
  if (p1 == p2) {
    sandbox = true
  }
  if (ai) {
    ai = true
    bonus = [null, 0, 0]
    leftturns = 999;
    turn = 1;
    chooseteam = false;
  }
  let data = generator.new(Math.min(p1.rank, p2.rank), ai);
  let game = {
    players: [p1, p2],
    fisher: [120, 120],
    gold: [0, 0],
    trail: [],
    lastturntime: [],
    bonus,
    unit: data.unit,
    deadPool: [],
    appearPool: [],
    field: data.field,
    turn,
    winner: 0,
    leftturns,
    started: time.clock(),
    lastturn: time.clock(),
    sticker: [],
    spoil: [],
    finished: false,
    chooseteam,
    id,
    sandbox,
    ai,
    frame: [],
    keyframe: 0,
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
  updateAkts(game);
  rules.spill(game);
  return game;
}
exports.order = (game, orderUnit, akt) => {
  //проверка корректный ли юнит и акт добавить в будущем, чтобы клиент не мог уронить сервер или сжулиьничать
  if (game && !game.finished) {
    fisher(game);
    game.trail = [];
    let unit = en.unitInPoint(game, orderUnit.x, orderUnit.y);
    if (akt.img == 'build') {
      game.unit.forEach(u => {
        if (u.team == game.turn)
          if (u.energy < 3 && u.isReady) {
            wrapper(game, u, { x: u.x, y: u.y, unit: u }).tire();
            //onTire
            rules.frog(game);
            rules.aerostat(game);
          }
      });
      let newu = wrapper(game, orderUnit, { x: orderUnit.x, y: orderUnit.y, unit: orderUnit }).addUnit(orderUnit, akt.x, akt.y, game.turn);
      if (newu) {
        game.gold[game.turn - 1] -= 5;
        newu.isReady = false;
      }
    } else {
      if (unit && unit.isReady) {
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
          if (_.isFunction(action[akt.img]))
            action[akt.img](wrapper(game, unit, { x: akt.x, y: akt.y, unit: en.unitInPoint(game, akt.x, akt.y) }), akt.data);
          else console.log('unkonwn akt', akt.img);
      }
    }
    //onOrder
    onOrder(game, unit, akt);
    updateAkts(game);
    send.data(game, { unit: orderUnit, akt });
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
    // onAkt.flower(game, u);
    if (u.akt.length == 0 && u.isActive) {
      u.isReady = false;
      u.isActive = false;
    }
  });
}
exports.endgame = (game, winner, words) => {
  game.finished = true;
  game.winner = winner;
  send.data(game);
  words = words || ['Вы победили.', 'Вы проиграли.']
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
    if (dif0 == 0)
      send.bot(game.players[0].id, words[0] + ' Ваш ранг не изменился: ' + game.players[0].rank, bot);
    else
      send.bot(game.players[0].id, words[0] + ' Ваш ранг теперь: ' + game.players[0].rank + ' (' + dif0 + ')', bot);
    if (dif1 == 0)
      send.bot(game.players[1].id, words[1] + ' Ваш ранг не изменился: ' + game.players[1].rank, bot);
    else
      send.bot(game.players[1].id, words[1] + ' Ваш ранг теперь: ' + game.players[1].rank + ' (' + dif1 + ')', bot);
  }
  player.clear(game.players[0], game.id)
  player.clear(game.players[1], game.id)

}
exports.surrender = (game, p) => {
  if (game && !game.finished) {
    if (p == 1) {
      exports.endgame(game, 2);
    }
    else {
      exports.endgame(game, 1);
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
    game.unit.forEach(u => {
      u.energy = 3;
      u.isReady = true;
    });
    game.leftturns--;
    if (game.leftturns == 0) {
      let flag = cnFlag();
      if (flag[0] > flag[1]) {
        exports.endgame(game, 1);
      } else {
        exports.endgame(game, 2);
      }
    } else {
      if (game.fisher[game.turn - 1] < 0) {
        // game.winner = game.turn == 1 ? 2 : 1;
        game.fisher[game.turn - 1] += 120;
      } else {
        game.fisher[game.turn - 1] += 120;
      }
    }
    fisher(game)

    //onEndTurn
    rules.mine(game)
    // rules.airdrop(game);
    cnFlag()

    game.turn = game.turn == 1 ? 2 : 1;

    //onStartTurn
    rules.telepath(game);
    rules.frog(game);
    rules.drillgun(game);
    rules.aerostat(game);
    rules.landmine(game);
    rules.egg(game);
    rules.rockettarget(game);
    rules.firestt(game);
    rules.splitOnEndturn(game)
    rules.worm(game);
    // rules.drill(game)

    onOrder(game);
    if (game.ai && game.turn == 1)
      worldshift(game);
    updateAkts(game);

    send.data(game);

    game.keyframe = game.frame.length - 1;
    if (game.ai && game.turn == 2) {
      ai.go(game, 2);
    }

    if (!game.sandbox)
      // send.gamelist(game.players[game.turn - 1].id, game.players[game.turn - 1], bot);
      send.bot(game.players[game.turn - 1].id, 'Ваш ход!\nЕсли потеряли ссылку на игру вызовите команду /play', bot);
  }
}



exports.setbonus = (game, p, bonus) => {
  game.bonus[3 - p] = bonus;
  if (game.sandbox) {
    game.bonus[1] = bonus;
    game.bonus[2] = bonus;
  }
  if (game.bonus[1] == 17 && game.bonus[2] == 17)
    this.rematch(game);
  else {
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
    updateAkts(game);
    send.data(game);
  }
}
function addbonus(game, unit) {
  if (unit.team !== game.turn) {
    game.unit.forEach(u => {
      if (u.team == 1) { u.team = 2; } else
        if (u.team == 2) u.team = 1;
    });
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        if (game.field[x][y] == 'team1') {
          game.field[x][y] = 'team2'
        } else
          if (game.field[x][y] == 'team2') {
            game.field[x][y] = 'team1'
          }
      }
    }
  }
  game.gold[0] += game.bonus[1]
  game.gold[1] += game.bonus[2]
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

exports.timeout = (game) => {
  console.log(game.id, 'check time', time.clock(), game.lastturn);
  if (time.clock() - game.lastturn > 86400 * 3) {
    let winner = game.turn == 1 ? 2 : 1;
    exports.endgame(game, winner, ['Техническая победа. Соперник давно не совершал ходов', 'Техническое поражение. Вы давно не совершали ходов.']);
    console.log(game.id + ' timeout', time.clock(), game.lastturn);
  }
}

let fisher = (game) => {
  game.lastturn = time.clock();
  if (!game.lastturntime[game.turn - 1]) {
    game.lastturntime[game.turn - 1] = time.clock();
    game.fisher[game.turn - 1] = 120;
  }
  game.fisher[game.turn - 1] -= time.clock() - game.lastturntime[game.turn - 1];
  game.lastturntime[game.turn - 1] = time.clock();
}

function worldshift(game) {
  for (let y = 0; y < game.field[0].length; y++) {
    const firstElement = game.field[0][y];
    for (let x = 0; x < game.field.length - 1; x++) {
      game.field[x][y] = game.field[x + 1][y];
      if (en.unitInPoint(game, x, y))
        wrapper(game).teleport(x, y, x - 1, y);
    }
    game.field[game.field.length - 1][y] = firstElement;
  }
}

exports.byId = (id) => {
  let g = games.find((e) => {
    return e.id == id
  });
  if (g == undefined) g = false
  return g
}