
const rules = require('./rules');
const meta = require('./meta');
const wrapper = require('./wrapper');

const _ = require('lodash');

module.exports = (game) => {
  do {
    for (let i = game.deadPool.length; i--; i > 0) {
      if (_.isFunction(meta[game.deadPool[i].tp].onDeath)) {
        meta[game.deadPool[i].tp].onDeath(wrapper(game, game.deadPool[i], { x: game.deadPool[i].x, y: game.deadPool[i].y, unit: game.deadPool[i] }));
      }
      game.deadPool.splice(i, 1)
    }
    rules.lover(game);
    rules.spill(game);
    rules.landmineexplosion(game);
    rules.slime(game);
    rules.eggcrack(game);
    rules.capture(game);
    rules.fireend(game);
    rules.wormportal(game);
  } while (game.deadPool.length > 0);
  // rules.dead(game);

}