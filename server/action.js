const en = require('./engine');
const _ = require('lodash');
const meta = require('./meta');


exports.teleport = (wd) => {
  wd.go(wd.target.x, wd.target.y);
  wd.me.status.remove('teleporter');
  wd.tire();
}
exports.diger = (wd) => {
  // wd.flywalk();

  if (wd.game.field[wd.target.x][wd.target.y] == 'grass')
    wd.game.field[wd.target.x][wd.target.y] = 'ground'
  // else if (wd.game.field[wd.target.x][wd.target.y] == 'ground')
  //   wd.game.field[wd.target.x][wd.target.y] = 'grass'
  // else if (wd.game.field[wd.target.x][wd.target.y] == 'water')
  //   wd.game.field[wd.target.x][wd.target.y] = 'grass'
  wd.tire();
}
exports.kill = (wd) => {
  wd.kill();
  wd.tire();
}
exports.polymorph = (wd) => {
  let tp
  do {
    tp = _.sample(Object.keys(meta));
  } while (tp == wd.target.unit.tp)
  wd.target.unit.tp = tp;
  wd.tire();
}

exports.wound = (wd) => {
  if (wd.target.unit.status.includes('wound')) {
    wd.target.unit.status.remove('wound')
    wd.addStatus('wound2');
  }
  else if (wd.target.unit.status.includes('wound2')) {
    wd.kill()
  }
  else
    wd.addStatus('wound');
  wd.tire();
}