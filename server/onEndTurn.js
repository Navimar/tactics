const en = require('./engine');


exports.telepath = (game) => {
    game.unit.forEach((u) => {
        u.status.remove('telepath')
    });
}
