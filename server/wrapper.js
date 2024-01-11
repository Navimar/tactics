const en = require("./engine");
const meta = require("./meta");
const _ = require("lodash");

module.exports = (game, me, target) => {
  return {
    game,
    me,
    target,
    walk: () => {
      let tire = Math.abs(me.x - target.x) + Math.abs(me.y - target.y);
      let mf = en.fieldInPoint(game, me.x, me.y);
      let tf = en.fieldInPoint(game, target.x, target.y);
      if (
        mf != tf &&
        mf != "water" &&
        tf != "water" &&
        mf.slice(0, -1) != "team" &&
        tf.slice(0, -1) != "team" &&
        tire == 1
      ) {
        tire = 3;
      }
      en.move(game, me, target.x, target.y);
      // me.energy -= d
      me.energy -= tire;
    },
    flywalk: () => {
      let tire = Math.abs(me.x - target.x) + Math.abs(me.y - target.y);
      en.move(game, me, target.x, target.y);
      // me.energy -= d
      me.energy -= tire;
    },
    damage: (x, y, d) => {
      if (x != undefined && y != undefined) {
        en.damage(game, en.unitInPoint(game, x, y), d);
      } else if (x != undefined && y == undefined) {
        en.damage(game, en.unitInPoint(game, x.x, x.y), d);
      } else {
        en.damage(game, en.unitInPoint(game, target.x, target.y), d);
      }
    },
    kill: (x, y) => {
      if (x != undefined && y != undefined) {
        en.death(game, en.unitInPoint(game, x, y));
      } else if (x != undefined && y == undefined) {
        en.death(game, x);
      } else {
        en.death(game, target.unit);
      }
    },
    disappear: (x, y) => {
      if (x != undefined && y != undefined) {
        en.disappear(game, en.unitInPoint(game, x, y));
      } else if (x != undefined && y == undefined) {
        en.disappear(game, x);
      } else {
        en.disappear(game, en.unitInPoint(game, target.x, target.y));
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
    spoilInPoint: (x, y, name) => {
      return en.spoilInPoint(game, x, y).filter((s) => {
        console.log(s);
        return s.name == name;
      });
    },
    tire: () => {
      me.isReady = false;
      me.isActive = false;
      // console.log(me,'tire wrapper');
    },
    teleport: (xfrom, yfrom, xto, yto) => {
      let u = en.unitInPoint(game, xfrom, yfrom);
      en.move(game, u, xto, yto);
    },
    move: (xto, yto) => {
      en.move(game, target.unit, xto, yto);
    },
    go: (xto, yto) => {
      en.move(game, me, xto, yto);
    },
    spoil: (name, x, y, data, team) => {
      en.addSpoil(game, name, x, y, data, team);
    },
    clearspoil: (x, y, name) => {
      for (i = game.spoil.length; i--; i > 0) {
        if (
          game.spoil[i].name == name &&
          game.spoil[i].x == x &&
          game.spoil[i].y == y
        )
          game.spoil.splice(i, 1);
      }
    },
    addStatus: (st, x, y) => {
      if (_.isFinite(x) && _.isFinite(y))
        en.addStatus(en.unitInPoint(game, x, y), st);
      else en.addStatus(target.unit, st);
    },
    addUnit: (tp, x, y, team) => {
      if (!_.isFinite(x) || !_.isFinite(x)) {
        x = target.x;
        y = target.y;
      }
      if (!team) team = me.team;
      if (!en.unitInPoint(game, x, y) && en.inField(x, y)) {
        let u = en.addUnit(game, tp, x, y, team);
        // console.log('in wrapper game.appearPool', game.appearPool);
        return u;
      }
    },
    changeTeam: (unit) => {
      if (unit.team != 3) unit.team = 3 - unit.team;
    },
    polymorph: (x, y) => {
      let unit;
      if (x != undefined && y != undefined) {
        unit = en.unitInPoint(game, x, y);
      } else if (x != undefined && y == undefined) {
        unit = x;
      } else {
        unit = target.unit;
      }
      if (unit) {
        let tp;
        do {
          tp = _.sample(Object.keys(meta));
        } while (
          tp == unit.tp ||
          meta[tp].class == "neutral" ||
          meta[tp].class == "none" ||
          meta[tp].img == "base"
        );
        unit.tp = tp;
      }
      game.trail.push({ img: "polymorph", x, y });
    },
  };
};
