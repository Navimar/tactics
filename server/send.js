const _ = require('lodash');
const meta = require('./meta');
const akter = require('./akter');
const onAkt = require('./onAkt');
const config = require('./config');
const player = require('./player');

exports.web = (p, game) => {
  msg = game.data;
  event = 'update';
  p.socket.emit(event, msg);
}

exports.bot = (id, text, bot) => {
  bot.telegram.sendMessage(id, text)
};
exports.botPhoto = (id, src, bot) => {
  bot.telegram.sendPhoto(id, src)
};

exports.gamelist = (id, p, bot) => {
  let key = player.setKey(p)
  let text = ''
  p.game.forEach(e => {
    if (e.sandbox)
      text += 'Песочница: '
    else
      text += e.players[0].id + ' vs ' + e.players[1].id + ' ';
    text += config.ip + ':' + config.port + "/?id=" + id + "&key=" + key + 'u' + '&game=' + e.id + '\n'
  });
  if (text == '')
    text = 'Нет активных игр\n/sandbox чтобы играть самому с собой\n/find чтобы найти соперника'
  else
    text = `Список активных игр:\n` + text
  bot.telegram.sendMessage(id, text)

};

exports.loginError = (socket, error) => {
  socket.emit('login', error);
}

exports.successfulLogin = (socket) => {
  socket.emit('login', 'success');
}

exports.data = (game) => {
  let getData = (game, player) => {
    let send = {
      sticker: game.sticker,
      spoil: (() => {
        let arr = []
        game.spoil.forEach(s => {
          // console.log(s.team,player);
          if (s.team == player || s.team == 3)
            arr.push(s);
        });
        return arr
      })(),
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
      gold: (() => {
        if (player == 1) return game.gold;
        if (player == 2) return game.gold.slice().reverse();
      })(),
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
      onAkt.telepath(game,u);
      onAkt.worm(game,u)
      onAkt.slime(game, u);
      onAkt.stazis(game, u);
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
  if (game) {
    let p0socket = game.players[0].socket.get(game.id)
    if (game.sandbox) {
      p0socket.emit('update', getData(game, game.turn));
    }
    else {
      let p1socket = game.players[1].socket.get(game.id)
      if (p0socket)
        p0socket.emit('update', getData(game, 1));
      if (p1socket)
        p1socket.emit('update', getData(game, 2));
    }
  }
}

exports.logicerror = (game, error) => {
  game.players[0].socket.get(game.id).emit('logic', error);
  game.players[1].socket.get(game.id).emit('logic', error);
}

// let send = (socket, event, msg, ctx) => {
//     ctx.reply 
// }