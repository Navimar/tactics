const rules = require('./rules');
const meta = require('./meta');
const Game = require('./game');

const wrapper = require('./wrapper');

const _ = require('lodash');

module.exports = (game, unit, akt) => {
  //проверяем жив ли кто вообще
  // if (game && !game.finished) {
  //   let one, two
  //   game.unit.forEach(u => {
  //     if (u.team == 1) {
  //       one = true;
  //     }
  //     if (u.team == 2) {
  //       two = true;
  //     }
  //   });
  //   if (!one && two) {
  //     Game.endgame(game, 2);
  //   }
  //   if (one && !two) {
  //     Game.endgame(game, 1);
  //   }
  //   if (!one && !two) {
  //     let flag = cnFlag();
  //     if (flag[0] > flag[1]) {
  //       Game.endgame(game, 1);
  //     } else {
  //       Game.endgame(game, 2);
  //     }
  //   }
  // }

  //возимся с мертвыми и выполняем правила
  do {
    for (let i = game.deadPool.length; i--; i > 0) {
      if (_.isFunction(meta[game.deadPool[i].tp].onDeath)) {
        meta[game.deadPool[i].tp].onDeath(wrapper(game, game.deadPool[i], { x: game.deadPool[i].x, y: game.deadPool[i].y, unit: game.deadPool[i] }));
      }
      rules.bomber(wrapper(game, game.deadPool[i], { x: game.deadPool[i].x, y: game.deadPool[i].y, unit: game.deadPool[i] }));
      game.deadPool.splice(i, 1);
    }
    rules.split(game, unit)
    rules.lover(game);
    rules.staziser(game);
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