// // const _ = require('underscore');
const bot = require('./bot');
const time = require('./time');

const config = require('./config');
const handle = require('./handle');

const input = {};

let dtLoop = Date.now();

let tickLengthMs = 1000 / config.speed;

/* gameLoop related variables */
// timestamp of each loop
let previousTick = Date.now();
// number of times gameLoop gets called
let actualTicks = 0;

var update = function (delta) {
    aVerySlowFunction(10)
};

/**
 A function that wastes time, and occupies 100% CPU while doing so.
 Suggested use: simulating that a complex calculation took time to complete.
 */
var aVerySlowFunction = function (milliseconds) {
    // waste time
    let start = Date.now();
    while (Date.now() < start + milliseconds) { }
};

input.tick = () => {
    tickLengthMs = 1000 / config.speed;
    let now = Date.now();
    actualTicks++;
    if (previousTick + tickLengthMs <= now) {
        let delta = (now - previousTick) / 1000;
        previousTick = now;

        // update(delta);
        time.tick();

        // console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks);
        actualTicks = 0;
    }

    if (Date.now() - previousTick < tickLengthMs - 16) {
        setTimeout(input.tick);
    } else {
        setImmediate(input.tick);
    }
};

input.socket = (io) => {

    io.on('connection', function (socket) {
        handle.socket(socket, 'connection');

        socket.on('disconnect', function () {
            handle.socket(socket, 'disconnect');
        });
        socket.on('order', function (msg) {
            handle.socket(socket, 'order', msg);
        });
        socket.on('endturn', function (msg) {
            handle.socket(socket, 'endturn', msg);
        });
        socket.on('bonus', function (msg) {
            handle.socket(socket, 'bonus', msg);
        });
        socket.on('surrender', function (msg) {
            handle.socket(socket, 'surrender', msg);
        });
        socket.on('rematch', function (msg) {
            handle.socket(socket, 'rematch', msg);
        });
        socket.on('login', function (msg) {
            handle.socket(socket, 'login', msg);
        });
        socket.on('frame', function (msg) {
            handle.socket(socket, 'frame', msg);
        });
    });
};

input.bot = () => {
    bot.on('text', msg => {
        handle.bot(msg, bot);
    });
};

module.exports = input;