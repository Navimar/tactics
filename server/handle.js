
const player = require('./player');
const game = require('./game');
const meta = require('./meta');

const queue = require('./queue');
const send = require('./send.js');
const config = require('./config');
const sha = require('sha256');

exports.socket = (socket, e, msg) => {
  if (e == 'login') {
    if (!msg.id) {
      p = player.register(0);
      p.rank = 999999;
      p.socket = socket;
      game.new(p, p);
      p.game.sandbox = true;
      send.data(p.game);
    } else {
      let p = player.byId(msg.id)
      if (p) {
        if (p.key == sha(msg.pass.slice(0, -1))) {
          p.socket = socket;
          send.successfulLogin(socket);
          send.data(p.game);
        } else {
          send.wrongPass(socket, msg.pass);
        }
      } else {
        send.wrongId(socket, msg.id);
      }
    }
  }
  if (e == 'connection') {
    // stat.connection();
  }
  if (e == 'disconnect') {
    // stat.disconnect();
  }
  if (e == 'order') {
    let p = player.bySocket(socket);
    if (p) {
      game.order(p.game, msg.unit, msg.akt);
    }
  }
  if (e == 'bonus') {
    let p = player.bySocket(socket);
    if (p && p.number) {
      game.setbonus(p.game, p.number, msg);
    }
  }
  if (e == 'surrender') {
    let p = player.bySocket(socket);
    if (p && p.number) {
      game.surrender(p.game, p.number, msg);
    }
  }
  if (e == 'rematch') {
    let p = player.bySocket(socket);
    if (p && p.number) {
      game.rematch(p, msg);
    }
  }
  if (e == 'endturn') {
    let p = player.bySocket(socket);
    if (p && p.game) {
      game.endturn(p.game, p.number);
    }
  }
};

exports.bot = (ctx, bot) => {
  let id = ctx.message.chat.id;
  let text = ctx.message.text;
  let p = player.byId(id);
  if (!p) {
    p = player.register(id);
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
    if (p.game) {
      send.bot(id, `Список активных игр:\n${config.ip}:` + config.port + "/?id=" + id + "&key=" + player.setKey(p) + 'u', bot);
    } else {
      send.bot(id, 'Нет активных игр\n/sandbox чтобы играть самому с собой\n/find чтобы найти соперника', bot);
    }
  }
  else if (text == '/find') {
    queue.find(p, bot)
  }
  else if (text == '/sandbox') {
    game.new(p, p)
    p.game.sandbox = true;
    send.bot(id, `Пройдите по ссылке, чтобы начать игру с самим собой:\n` + player.link(p), bot);
  }
  else if (text == '/cancel') {
    queue.cancel(p)
    send.bot(id, 'поиск отменен', bot);
  }
  else if (text == '/rank') {
    let mes = 'Ваш ранг ' + p.rank
    mes += '\n\nВам доступны юниты:';
    arr.forEach((e) => {
      if (meta[e.key].weight > 0) {
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
        send.botPhoto(id, { source: __dirname + '/../img/' + e.key +'.png' }, bot )
        send.bot(id, meta[e.key].description, bot)
        f = 0
      }
    });
    if (f) {
      send.bot(id, '/find чтобы найти соперника\n/play чтобы вернутся в игру\n/sandbox чтобы играть самому с собой\n/cancel чтобы отменить поиск соперника\n/rank чтобы проверить свой ранг\n/tutorial чтобы научится играть!', bot)
    }
  }
};