const en = require('./engine');
const meta = require('./meta');
const akter = require('./akter');
const { unitInPoint } = require('./engine');

exports.slime = (game, u) => {
  // game.unit.forEach(u => {
  u.akt = u.akt.filter(a => {
    if (u.status.includes('slime') && (a.img == 'move' || a.img == 'fly' || a.img == 'take')) {
      return false;
    } else {
      return true;
    }
  });
  // });
}
exports.telepath = (game, u) => {
  // game.unit.forEach(u => {
  u.akt = u.akt.filter(a => {
    if (a.img == 'telepath' && en.unitInPoint(game, a.x, a.y)) {
      if (en.unitInPoint(game, a.x, a.y).status.includes('telepath'))
        return false;
      else return true
    } else {
      return true;
    }
  });
  // });
}

exports.worm = (game, u) => {
  if (u.tp != 'frog')
    for (i = game.spoil.length; i--; i > 0) {
      if (game.spoil[i].name == 'wormportal' && game.spoil[i].x == u.x && game.spoil[i].y == u.y) {

        let oldx = u.x
        let oldy = u.y
        u.x = game.spoil[i].data.worm.x;
        u.y = game.spoil[i].data.worm.y;
        u.akt = u.akt.concat(meta[u.tp].akt(akter(game, u)))
        // u.akt = meta[u.tp].akt(akter(game, u));
        u.x = oldx;
        u.y = oldy;
      }
    }
}

exports.stazis = (game, u) => {
  if (u.status.includes('stazis'))
    u.akt = [];
  u.akt = u.akt.filter(a => {
    if (en.unitInPoint(game, a.x, a.y) && en.unitInPoint(game, a.x, a.y).status.includes('stazis'))
      return false
    else
      return true
  });
}