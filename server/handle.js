
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

exports.bot = (msg, bot) => {
  // console.log(msg);
  let id = msg.from.id;
  let text = msg.text;
  let p = player.byId(id);
  if (!p) {
    p = player.register(id);
  }
  if (text == '/play') {
    if (p.game) {
      send.bot(id, config.ip + ":" + config.port + "/?id=" + id + "&key=" + player.setKey(p) + 'u', bot);
    } else {
      send.bot(id, 'нет активных игр\n/sandbox чтобы играть самому с собой\n/find чтобы найти соперника', bot);
    }
  }
  else if (text == '/find') {
    queue.find(p, bot)
  }
  else if (text == '/sandbox') {
    game.new(p, p)
    p.game.sandbox = true;
    send.bot(id, config.ip + ":" + config.port + "/?id=" + id + "&key=" + player.setKey(p) + 'u', bot);
  }
  else if (text == '/cancel') {
    queue.cancel(p)
    send.bot(id, 'поиск отменен');
  }
  else if (text == '/rank') {
    send.bot(id, 'Ваш ранг ' + p.rank, bot);

  }
  else {
    send.bot(id, '/sandbox чтобы играть самому с собой\n/find чтобы найти соперника\n/cancel чтобы отменить поиск соперника\n/rank чтобы проверить свой ранг', bot)
  }
};