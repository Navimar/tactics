const en = require('./engine');

exports.frog = (game) => {
  game.unit.forEach((u) => {
    u.status.remove('frog')
  });
}