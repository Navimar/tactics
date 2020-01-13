const _ = require('lodash');
const meta = require('./meta');
const akter = require('./akt');

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
      leftturns: game.leftturns,
      win: (() => {
        if (game.winner != 0) {
          if (player == game.winner) { return 'win' } else { return 'lose' }
        }
        return false
      })(),
      field: (() => {
        let arr = [];
        for (let x = 0; x < 9; x++) {
          arr[x] = [];
          for (let y = 0; y < 9; y++) {
            arr[x][y] = game.data.field[x][y];
            if (player == 2) {
              if (game.data.field[x][y] == 'team1')
                arr[x][y] = 'team2';
              if (game.data.field[x][y] == 'team2')
                arr[x][y] = 'team1';
            }
          }
        }
        return arr
      })(),
      unit: [],
      turn: (() => {
        if (game.turn == player) {
          return true;
        }
      })(),
    };
    game.data.unit.forEach(u => {
      let img = _.isFunction(meta[u.tp].img) ? meta[u.tp].img(u.data) : meta[u.tp].img;
      let akt = [];
      if (u.isReady) {
        akt = meta[u.tp].akt(akter(game, u));
      }
      if (akt.length == 0) {
        u.isActive = false;
        u.isReady = false;
      }
      send.unit.push({
        img,
        isActive: u.isActive,
        isReady: u.isReady,
        life: u.life,
        m: u.m,
        x: u.x,
        y: u.y,
        akt,
        color: (() => {
          if (player == 1) return u.team;
          if (player == 2) return (u.team == 1 ? 2 : 1);
        })(),
      });
    });
    return send;
  }
  console.log('insend')

  console.log(game)
  if (game.sandbox) {
    game.players[0].socket.emit('update', getData(game, game.turn));
  }
  else {
    if (game.players[0].socket)
      game.players[0].socket.emit('update', getData(game, 1));
    if (game.players[1].socket)
      game.players[1].socket.emit('update', getData(game, 2));
  }
}

// let send = (socket, event, msg, ctx) => {
//     ctx.reply 
// }