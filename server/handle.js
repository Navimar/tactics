
const player = require('./player');
const game = require('./game');
const queue = require('./queue');
const send = require('./send.js');
const config = require('./config');
const sha = require('sha256');

exports.socket = (socket, e, msg) => {
  if (e == 'login') {
    if (!msg.id) {
      p = player.register(0);
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
    if (p && p.number) {
      game.order(p.game, p.number, msg.unit, msg.akt);
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
    send.bot(id, 'поиск отменен',bot);
  }
  else if (text == '/rank') {
    send.bot(id, 'Ваш ранг ' + p.rank, bot);

  }
  else {
    send.bot(id, '/find чтобы найти соперника\n/play чтобы вернутся в игру\n/sandbox чтобы играть самому с собой\n/cancel чтобы отменить поиск соперника\n/rank чтобы проверить свой ранг', bot)
  }
};