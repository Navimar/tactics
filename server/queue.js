const game = require("./game");
const send = require("./send");
const player = require("./player");
const dotenv = require("dotenv");

dotenv.config();

let queue = [];
exports.find = (p, bot) => {
  if (queue.indexOf(p) == -1) {
    if (queue.length == 1) {
      let g = game.new(queue[0], p);
      p.game.push(g);
      queue[0].game.push(g);
      send.bot(
        p.id,
        "Вы нашли игру" + "\n" + "Ваш ранг " + p.rank + "\n" + "Ранг соперника " + queue[0].rank,
        bot
      );
      send.bot(
        queue[0].id,
        "Вы нашли игру" + "\n" + "Ваш ранг " + queue[0].rank + "\n" + "Ранг соперника " + p.rank,
        bot
      );
      send.gamelist(p.id, p, bot);
      send.gamelist(queue[0].id, queue[0], bot);
      queue = [];
    } else {
      queue = [p];
      // console.log(queue[0]);
      player.list().forEach((e) => {
        if (p.id == e.id) send.bot(p.id, "Вы ищете игру", bot);
        else if (e.subscribe)
          send.bot(
            e.id,
            "Игрок с рангом " +
              p.rank +
              " ищет игру, нажмите /find, чтобы присоединиться к игре!\n\n(/subscribe, чтобы больше не получать уведомлений)",
            bot
          );
      });
    }
  } else {
    send.bot(p.id, "Вы уже ищете игру", bot);
  }
};
exports.cancel = (p, bot) => {
  if (queue.indexOf(p) != -1) {
    queue = [];
  }
};
