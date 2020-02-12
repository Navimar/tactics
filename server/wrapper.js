const en = require('./engine');
// const en = require('./engine');
const _ = require('lodash');

module.exports = (game, me, target) => {
  return {
    game,
    me,
    target,
    walk: () => {
      let tire = Math.abs(me.x - target.x) + Math.abs(me.y - target.y)
      let mf = en.fieldInPoint(game, me.x, me.y)
      let tf = en.fieldInPoint(game, target.x, target.y)
      if ((mf != tf && mf.slice(0, -1) != 'team' && tf.slice(0, -1) != 'team') && tire == 1) {
        tire = 3;
      }
      en.move(game, me, target.x, target.y);
      // me.energy -= d
      me.energy -= tire;
    },
    damage: (x, y, d) => {
      let trail = 'damage';
      if (x != undefined && y != undefined) {
        let u = en.unitInPoint(game, x, y)
        if (me.team+'' == u.team+'')
          trail = 'ff'
        en.damage(game, u, d, trail);
      } else if (x != undefined && y == undefined) {
        let u = en.unitInPoint(game, x.x, x.y)
        if (me.team == u.team)
          trail = 'ff'
        en.damage(game, u, d, trail);
      } else {
        if (me.team == target.unit.team)
          trail = 'ff'
        en.damage(game, target.unit, d, trail);
      }
    },
    noenergy: () => {
      me.energy = 0;
    },
    isOccupied: (x, y) => {
      return en.isOccupied(game, x, y);
    },
    unitInPoint: (x, y) => {
      return en.unitInPoint(game, x, y);
    },
    tire: () => {
      me.isReady = false;
      me.isActive = false;
      // console.log(me,'tire wrapper');
    },
    move: (xto, yto) => {
      en.move(game, target.unit, xto, yto);
    },
    go: (xto, yto) => {
      en.move(game, me, xto, yto);
    },
    addStatus: (st) => {
      en.addStatus(en.unitInPoint(game, target.x, target.y), st);
    },
    addUnit: (tp, life) => {
      return en.addUnit(game, tp, target.x, target.y, me.team, life)
    },
  }
}