
const rules = require('./rules');

module.exports = (game) => {
  rules.dead(game);
  rules.spill(game);
  rules.landmineexplosion(game);
  rules.slime(game);
  rules.eggcrack(game);
  rules.capture(game);
  rules.fireend(game);
}