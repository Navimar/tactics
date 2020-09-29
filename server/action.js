const en = require('./engine');
const _ = require('lodash');

exports.teleport = (wd) => {
  wd.go(wd.target.x, wd.target.y);
  wd.me.status.remove('teleporter');
  wd.tire();
}