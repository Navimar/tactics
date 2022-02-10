const en = require('./engine');
const _ = require('lodash');
const meta = require('./meta');


exports.teleport = (wd) => {
  wd.go(wd.target.x, wd.target.y);
  wd.me.status.remove('teleporter');
  wd.tire();
}
exports.digger = (wd) => {
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
  wd.polymorph();
  wd.tire();
}

exports.wound = (wd) => {
  if (wd.target.unit.status.includes('wound2')) {
    wd.kill()
  }
  else if (wd.target.unit.status.includes('wound')) {
    wd.target.unit.status.remove('wound')
    wd.addStatus('wound2');
  }
  else
    wd.addStatus('wound');
  wd.tire();
}