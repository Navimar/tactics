const en = require('./engine');

module.exports = (game, me, target) => {
  return {
    game,
    me,
    target,
    walk: () => {
      let tire = Math.abs(me.x - target.x) + Math.abs(me.y - target.y)
      en.move(game, me, target.x, target.y);
      me.energy -= tire;
      if (game.field[me.x][me.y] == 'team1' && me.team == 2) game.field[me.x][me.y] = 'team2';
      if (game.field[me.x][me.y] == 'team2' && me.team == 1) game.field[me.x][me.y] = 'team1';
    },
    damage: (x, y) => {
      if (x != undefined && y != undefined) {
        en.damage(game, en.unitInPoint(game, x, y));
      } else {
        en.damage(game, en.unitInPoint(game, target.x, target.y));
      }
    },
    tire: () => {
      me.isReady = false;
      me.isActive = false;
    },
    move: (xto, yto) => {
      en.move(game, en.unitInPoint(game, target.x, target.y), xto, yto);
    }
  }
}