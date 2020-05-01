const handle = require('./handle');
const player = require('./player');
const en = require('./engine');
const game = require('./game');
const sha = require('sha256');

let socket = {
    emit: (e, msg) => {
        // console.log('event');
        // console.log(e);
        // console.log('value');
        // console.log(msg);
    }
}
let answer;
let bot = {
    telegram: {
        sendMessage: (id, text) => {
            answer = { id, text };
            // console.log('answer', answer);
        }
    }
}
module.exports = () => {
    let msg = {
        from: { id: 30626617 },
        text: '/sandbox',
    }
    handle.bot(msg, bot);
    pass = answer.text.split('=')[2];
    handle.socket(socket, 'login', { id: 30626617, pass })
    // console.log(en.unitInPoint(game.new({},{}),0,0))
    // handle.socket(socket, 'order', answer[0],)
    let g = game.new({},{}).sanbox=true
    msg = {
        from: { id: 1 },
        text: '/find',
    }
    handle.bot(msg, bot);
    msg = {
        from: { id: 2 },
        text: '/find',
    }
    handle.bot(msg, bot);
    pass = answer.text.split('=')[2];
    handle.socket(socket, 'login', { id: 1, pass})
}
