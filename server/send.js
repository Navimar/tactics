const _ = require('lodash');
const meta = require('./meta');
const akter = require('./akt');
const wrapper = require('./wrapper');
const onAkt = require('./onAkt');
// const time = require('./time');

exports.web = (p, game) => {
  msg = game.data;
  event = 'update';
  p.socket.emit(event, msg);
}

exports.bot = (id, text, bot) => {
  bot.sendMessage(id, text);
};

exports.wrongId = (socket, id) => {
  socket.emit('login', 'wrong id ' + id);
}
exports.successfulLogin = (socket) => {
  socket.emit('login', 'success');

}
exports.wrongPass = (socket, pass) => {
  socket.emit('login', 'wrong pass ' + pass);
}

exports.success = (socket) => {
  socket.emit('login', 'success');
}

exports.data = (game) => {
  let getData = (game, player) => {
    let send = {
      sticker: game.sticker,
      finished: game.finished,
      leftturns: game.leftturns,
      chooseteam: game.chooseteam,
      trail: game.trail,
      bonus: (() => {
        if (game.bonus[3 - player] === null) return 'choose'
        if (game.bonus[1] !== null && game.bonus[2] !== null) return 'ready'
        if (game.bonus[3 - player] !== null) return 'wait'
      })(),
      win: (() => {
        if (game.winner != 0) {
          if (player == game.winner) { return 'win' } else { return 'defeat' }
        }
        return false
      })(),
      field: (() => {
        let arr = [];
        for (let x = 0; x < 9; x++) {
          arr[x] = [];
          for (let y = 0; y < 9; y++) {
            arr[x][y] = game.field[x][y];
            if (player == 2) {
              if (game.field[x][y] == 'team1')
                arr[x][y] = 'team2';
              if (game.field[x][y] == 'team2')
                arr[x][y] = 'team1';
            }
          }
        }
        return arr
      })(),
      unit: [],
      fisher: (() => {
        if (player == 1) return game.fisher;
        if (player == 2) return game.fisher.slice().reverse();
      })(),
      turn: (() => {
        if (game.turn == player)
          return true;
        else
          return false
      })(),
    };

    game.unit.forEach(u => {
      u.akt = [];
      if (u.isReady) {
        u.akt = meta[u.tp].akt(akter(game, u));
      }
      onAkt.telepath(game);
      onAkt.slime(game);
    });

    game.unit.forEach(u => {
      send.unit.push({
        img: _.isFunction(meta[u.tp].img) ? meta[u.tp].img(u.data) : meta[u.tp].img,
        status: u.status,
        isActive: u.isActive,
        isReady: u.isReady,
        life: u.life,
        m: u.m,
        x: u.x,
        y: u.y,
        sticker: u.sticker ? meta[u.sticker.tp].img : false,
        akt: u.akt,
        color: (() => {
          if (player == 1) return u.team;
          if (player == 2) return (() => {
            if (u.team == 1) { return 2 } else
              if (u.team == 2) { return 1 } else
                return u.team;
          })();
        })(),
        canMove: (() => {
          if ((game.chooseteam && u.team != 3) || u.team == player || u.status.includes('telepath'))
            return true;
          return false;
        })(),
      });
    });
    return send;
  }
  if (game.sandbox) {
    game.players[0].socket.emit('update', getData(game, game.turn));
  }
  else {
    if (game.players[0].socket && game.players[0].game == game)
      game.players[0].socket.emit('update', getData(game, 1));
    if (game.players[1].socket && game.players[1].game == game)
      game.players[1].socket.emit('update', getData(game, 2));
  }
}

exports.logicerror = (game, error) => {
  game.players[0].socket.emit('logic', error);
  game.players[1].socket.emit('logic', error);
}

// let send = (socket, event, msg, ctx) => {
//     ctx.reply 
// }