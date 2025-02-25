const rules = require("./rules");
const meta = require("./meta");

const wrapper = require("./wrapper");

const _ = require("lodash");

module.exports = (game, unit, akt) => {
  //возимся с мертвыми и выполняем правила
  do {
    for (let i = game.deadPool.length; i--; i > 0) {
      rules.drop(
        wrapper(game, game.deadPool[i], {
          x: game.deadPool[i].x,
          y: game.deadPool[i].y,
          unit: game.deadPool[i],
        })
      );
      if (_.isFunction(meta[game.deadPool[i].tp].onDeath)) {
        meta[game.deadPool[i].tp].onDeath(
          wrapper(game, game.deadPool[i], {
            x: game.deadPool[i].x,
            y: game.deadPool[i].y,
            unit: game.deadPool[i],
          })
        );
      }
      rules.bomber(
        wrapper(game, game.deadPool[i], {
          x: game.deadPool[i].x,
          y: game.deadPool[i].y,
          unit: game.deadPool[i],
        })
      );
      game.deadPool.splice(i, 1);
    }
    for (let i = game.appearPool.length; i--; i > 0) {
      // console.log(game.appearPool[i])
      if (_.isFunction(meta[game.appearPool[i].tp].onAppear)) {
        meta[game.appearPool[i].tp].onAppear(
          wrapper(game, game.appearPool[i], {
            x: game.appearPool[i].x,
            y: game.appearPool[i].y,
            unit: game.appearPool[i],
          })
        );
      }
      game.appearPool.splice(i, 1);
    }
    rules.hoplite(game);
    // rules.split(game, unit)
    rules.lover(game);
    // rules.staziser(game);
    rules.spill(game);
    rules.landmineexplosion(game);
    rules.slime(game);
    // rules.eggcrack(game);
    rules.capture(game);
    rules.fireInWater(game);
    rules.unitInFire(game);
    rules.wormportal(game);
    if (game.ai != "mission") rules.genocide(game);
    if (game.ai == "mission") rules.missionDefeat(game);
    rules.maxEnergyLimit(game);
    // if (!game.ai) rules.flagwin(game);
  } while (game.deadPool.length > 0);
};
