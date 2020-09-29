
const player = require('./player');
const game = require('./game');
const meta = require('./meta');
const queue = require('./queue');
const send = require('./send.js');
const config = require('./config');
const sha = require('sha256');

exports.socket = (socket, e, msg) => {
  if (msg) {
    let gm = game.byId(msg.gameid);
    if (!gm)
      send.loginError(socket, 'Игра не найдена ' + msg.gameid);
    else {
      if (e == 'login') {
        if (!msg.id) {
          send.loginError(socket, 'не указан ID ползователя');
        } else {
          let p = player.byId(msg.id)
          if (p) {
            if (p.key == sha(msg.pass.slice(0, -1))) {
              player.addSocket(p, gm.id, socket)
              send.successfulLogin(socket);
              send.data(gm);
            } else {
              send.loginError(socket, 'Неверный ключ ' + msg.pass);
            }

          } else {
            send.loginError(socket, 'Неверный ID пользователя ' + msg.id);
          }
        }
      }
      if (e == 'connection') {
        // stat.connection();
      }
      if (e == 'disconnect') {
        // player.deleteSocket(p,socket, gm.id)
        // stat.disconnect();
      }
      if (e == 'order') {
        // console.log('order', gm)
        let p = player.bySocket(socket, gm.id);
        if (p) {
          game.order(gm, msg.unit, msg.akt);
        }
      }
      if (e == 'bonus') {
        let p = player.bySocket(socket, gm.id);
        if (p) {
          let n = 1
          if (gm.players[0].id != p.id)
            n = 2
          game.setbonus(gm, n, msg.bonus);
        } else console.log('!p')
      }
      if (e == 'surrender') {
        let p = player.bySocket(socket, gm.id);
        if (p) {
          let n = 1
          if (gm.players[0].id != p.id)
            n = 2
          game.surrender(gm, n, msg);
        }
      }
      if (e == 'rematch') {
        game.rematch(gm);
      }
      if (e == 'endturn') {
        let p = player.bySocket(socket, gm.id);
        if (p) {
          let n = 1
          if (gm.players[0].id != p.id)
            n = 2
          game.endturn(gm, n);
        }
      }
    }
  } else {
    //!msg

  }
};

exports.bot = (ctx, bot) => {
  let id = ctx.message.chat.id;
  let text = ctx.message.text;
  let username = ctx.message.from.username;
  let p = player.byId(id);
  if (!p) {
    p = player.register(id, username);
  }

  let arr = []
  Object.keys(meta).forEach(function (key) {
    arr.push({
      key, rank: meta[key].rank, name: meta[key].name
    });
  });
  arr = arr.sort((a, b) => { return a.rank - b.rank })

  if (text == '/start') {
    send.bot(id, 'Добро пожаловать в Unitcraft. Вам представился шанс продемонстрировать всю глубину тактической мысли игрокам со всего света.\nВызовите /help, чтобы увидеть полный список команд.', bot);

  }
  else if (text == '/play' || text == '/games') {
    send.gamelist(id, p, bot);
  }
  else if (text == '/find') {
    queue.find(p, bot)
  }
  else if (text == '/sandbox') {
    p.game.push(game.new(p, p))
    send.bot(id, 'Игра успешно создана!', bot);
    send.gamelist(id, p, bot);
  }
  else if (text == '/cancel') {
    queue.cancel(p)
    send.bot(id, 'поиск отменен', bot);
  }
  else if (text == '/rank') {
    let mes = 'Ваш ранг ' + p.rank
    mes += '\n\nВам доступны юниты:';
    arr.forEach((e) => {
      if (meta[e.key].class != 'none') {
        if (meta[e.key].rank <= p.rank)
          mes += '\n/' + e.key + ' ' + e.name
      }
    });
    send.bot(id, mes, bot);
  }
  else if (text == '/tutorial') {
    send.bot(id, 'Обучение пока не готово ¯\\_(ツ)_/¯\nНо я вам так расскажу. В общем это пошаговая игра. Просто ходите каждым юнитом в каждый свой ход и перебейте всех врагов :) Чтобы узнать способности юнитов и посмотреть какие юниты доступны на вашем ранге используйте команду /rank. Выигрывайте, чтобы открыть новых юнитов! В очереди на игру пока никого не водится, поэтому договаривайтесь об играх заранее, желающих сыграть можно найти в нашей группе @unitcraft', bot);

  }
  else {
    let f = 1;
    arr.forEach((e) => {
      if (e.key == text.slice(1)) {
        send.botPhoto(id, { source: __dirname + '/../img/' + e.key + '.png' }, bot)
        send.bot(id, meta[e.key].description, bot)
        f = 0
      }
    });
    if (f) {
      send.bot(id, '/find чтобы найти соперника\n/play чтобы вернутся в игру\n/sandbox чтобы играть самому с собой\n/cancel чтобы отменить поиск соперника\n/rank чтобы проверить свой ранг\n/tutorial чтобы научится играть!', bot)
    }
  }
};