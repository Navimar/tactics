const game = require('./game');

let queue = []
exports.find = (p) => {
    if (queue.indexOf(p) == -1) {
        if (queue.length == 1) {
            game.new(queue[0], p)
            queue = [];
        } else {
            queue = [p];
        }
    } else {
        throw 'clone in queue'
    }
}