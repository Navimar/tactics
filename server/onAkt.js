const en = require('./engine');

exports.slime = (game) => {
    game.unit.forEach(u => {
        u.akt = u.akt.filter(a => {
            if (u.status.includes('slime') && (a.img == 'move' || a.img == 'fly' || a.img == 'take')) {
                return false;
            } else {
                return true;
            }
        });
    });
}
exports.telepath = (game) => {
    game.unit.forEach(u => {
        u.akt = u.akt.filter(a => {
            if (a.img == 'telepath' && en.unitInPoint(game, a.x, a.y)) {
                if (en.unitInPoint(game, a.x, a.y).status.includes('telepath'))
                    return false;
                else return true
            } else {
                return true;
            }
        });
    });

}