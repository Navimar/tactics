const player = require("./player");
const game = require("./game");
const meta = require("./meta");
const queue = require("./queue");
const send = require("./send.js");

const sha = require("sha256");
const fs = require("fs");

exports.start = () => {
  register_players();
  count_units();

  function count_units() {
    let totalUnits = 0;
    let totalUnitsWithoutUndefinedAndNone = 0;
    let unitsByClass = {};
    let undefinedClass = [];

    // Группируем юниты по классам
    Object.keys(meta).forEach(function (key) {
      const unitClass = meta[key].class;
      if (unitClass === undefined) {
        undefinedClass.push({ name: key });
      } else {
        if (!unitsByClass[unitClass]) {
          unitsByClass[unitClass] = [];
        }
        unitsByClass[unitClass].push({ name: key });
      }
    });

    // Выводим информацию по каждому классу
    Object.keys(unitsByClass).forEach((unitClass) => {
      const units = unitsByClass[unitClass];
      console.log(`\nClass: ${unitClass} (Total: ${units.length})`);
      units.forEach((unit) => {
        totalUnits++;
        if (unitClass !== "none" && unitClass !== "neutral") {
          totalUnitsWithoutUndefinedAndNone++;
        }
        console.log(`* ${unit.name}`);
      });
    });

    // Выводим юниты с неопределённым классом
    if (undefinedClass.length > 0) {
      console.log(`\nClass: undefined (Total: ${undefinedClass.length})`);
      undefinedClass.forEach((unit) => {
        totalUnits++;
        console.log(`* ${unit.name}`);
      });
    }

    // Общее количество юнитов
    console.log(
      `Total Units without undefined, 'none', and 'neutral': ${totalUnitsWithoutUndefinedAndNone}`
    );
    console.log(`
Total Units: ${totalUnits}`);
  }

  function register_players() {
    fs.readdir("data", (err, files) => {
      if (err) {
        return console.error(`Unable to scan directory: ${err}`);
      }

      // Перебираем все файлы в директории
      files.forEach((file) => {
        const filePath = `data/${file}`;
        // Проверяем, является ли элемент файлом (а не директорией)
        if (fs.lstatSync(filePath).isFile()) {
          player.register(file);
        }
      });
    });
  }
};

exports.tick = (clock) => {
  if (clock % 3600 == 0)
    game.games().forEach((g) => {
      if (!g.finished) game.timeout(g);
    });
};

exports.socket = (socket, e, msg) => {
  if (msg) {
    let gm = game.byId(msg.gameid);
    if (!gm) send.loginError(socket, "Игра не найдена " + msg.gameid);
    else {
      if (e == "login") {
        if (!msg.id) {
          send.loginError(socket, "не указан ID ползователя");
        } else {
          let p = player.byId(msg.id);
          if (p) {
            if (p.key == sha(msg.pass.slice(0, -1))) {
              player.addSocket(p, gm.id, socket);
              send.successfulLogin(socket);
              send.data(gm);
            } else {
              send.loginError(socket, "Неверный ключ " + msg.pass);
            }
          } else {
            send.loginError(socket, "Неверный ID пользователя " + msg.id);
          }
        }
      }
      if (e == "frame") {
        let p = player.bySocket(socket, gm.id);
        if (p) send.frame(gm, p, msg.frame);
      }
      if (e == "connection") {
        // stat.connection();
      }
      if (e == "disconnect") {
        // player.deleteSocket(p,socket, gm.id)
        // stat.disconnect();
      }
      if (e == "order") {
        // console.log('order', gm)
        let p = player.bySocket(socket, gm.id);
        if (p) {
          if (msg.akt && msg.akt.img == "build")
            if (
              msg.unit == "rocket3" ||
              msg.unit == "rocket2" ||
              msg.unit == "rocket1" ||
              msg.unit == "rocket0"
            )
              msg.unit = "rocket";
          game.order(gm, msg.unit, msg.akt);
        }
      }
      if (e == "bonus") {
        let p = player.bySocket(socket, gm.id);
        n = player.number(gm, p);
        game.setbonus(gm, n, msg.bonus);
      }
      if (e == "surrender") {
        let p = player.bySocket(socket, gm.id);
        if (p) {
          let n = 1;
          if (gm.players[0].id != p.id) n = 2;
          game.surrender(gm, n, msg);
        }
      }
      if (e == "rematch") {
        game.rematch(gm);
      }
      if (e == "endturn") {
        let p = player.bySocket(socket, gm.id);
        if (p) {
          let n = 1;
          if (gm.players[0].id != p.id) n = 2;
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
  if (!p) p = player.register(id);
  if (p.username != username) player.setUsername(p, username);

  let arr = [];
  Object.keys(meta).forEach(function (key) {
    arr.push({
      key,
      rank: meta[key].rank,
      name: meta[key].name,
    });
  });
  arr = arr.sort((a, b) => {
    return a.rank - b.rank;
  });

  if (text == "/start") {
    send.bot(
      id,
      "Добро пожаловать в Unitcraft. Вам представился шанс продемонстрировать всю глубину тактической мысли игрокам со всего света.\nВызовите /help, чтобы увидеть полный список команд.",
      bot
    );
  } else if (text == "/play" || text == "/games") {
    send.gamelist(id, p, bot);
  } else if (text == "/find") {
    queue.find(p, bot);
  } else if (text == "/sandbox") {
    p.game.push(game.new(p, p));
    send.bot(id, "Игра успешно создана!", bot);
    send.gamelist(id, p, bot);
  }
  // else if (text == '/single') {
  //   p.game.push(game.new(p, p, 'ai'))
  //   send.bot(id, 'Игра успешно создана!', bot);
  //   send.gamelist(id, p, bot);
  // }
  else if (text == "/cancel") {
    queue.cancel(p);
    send.bot(id, "Поиск отменен", bot);
  } else if (text == "/subscribe") {
    let mes;
    if (player.stop(p))
      mes = "Теперь вы будете получать сообщение, когда другие игроки будут искать соперника";
    else mes = "Вы больше не будете получать сообщение, когда другие игроки будут искать соперника";
    send.bot(id, mes, bot);
  } else if (text == "/rank") {
    let mes = "Ваш ранг " + p.rank;

    send.bot(id, mes, bot);
  } else if (text == "/tutorial") {
    let mes =
      "Обучение пока не готово ¯\\_(ツ)_/¯\nНо я вам так расскажу. В общем это пошаговая игра. Просто ходите каждым юнитом в каждый свой ход и перебейте всех врагов :) В очереди на игру пока никого не водится, поэтому договаривайтесь об играх заранее, желающих сыграть можно найти в нашей группе @unitcraft";
    // mes += '\n\nВам доступны юниты:';
    // arr.forEach((e) => {
    //   if (meta[e.key].class != 'none')
    //     mes += '\n/' + e.key + ' ' + e.name
    // });
    send.bot(id, mes, bot);
  } else {
    let f = 1;
    arr.forEach((e) => {
      if (e.key == text.slice(1)) {
        send.botPhoto(id, { source: __dirname + "/../img/" + e.key + ".png" }, bot);
        send.bot(id, meta[e.key].description, bot);
        f = 0;
      }
    });
    if (f) {
      send.bot(
        id,
        "/find чтобы найти соперника\n/cancel чтобы отменить поиск соперника\n/play чтобы вернуться в игру\n/subscribe чтобы отписаться/подписаться на уведомления о том, что кто-то ищет игру\n" +
          // '/mission чтобы играть с AI\n'+
          "/sandbox чтобы играть самому с собой\n/rank чтобы проверить свой ранг\n/tutorial чтобы научится играть!",
        bot
      );
    }
  }
};
