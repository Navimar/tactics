const game = require('./game');
const send = require('./send');
const player = require('./player');
const config = require('./config');


let queue = []
exports.find = (p, bot) => {
    if (queue.indexOf(p) == -1) {
        if (queue.length == 1) {
            game.new(queue[0], p)
            send.bot(p.id, "Вы нашли игру", bot);
            // console.log(queue);
            send.bot(queue[0].id, "Вы нашли игру", bot);
            send.bot(p.id, config.ip + ":" + config.port + "/?id=" + p.id + "&key=" + player.setKey(p) + 'u', bot);
            send.bot(queue[0].id, config.ip + ":" + config.port + "/?id=" + queue[0].id + "&key=" + player.setKey(queue[0]) + 'u', bot);
            queue = [];
        } else {
            queue = [p];
            // console.log(queue[0]);
            send.bot(p.id, "Вы ищите игру", bot);
        }
    } else {
        send.bot(p.id, "Вы уже ищите игру", bot);
    }
}