const en = require("./engine");
const meta = require("./meta");
const _ = require("lodash");

module.exports = (game, me, target) => {
  return {
    game,
    me,
    target,
    walk: (energyCost) => {
      me.animation.push({
        name: "walk",
        fromX: me.x,
        fromY: me.y,
      });
      en.move(game, me, target.x, target.y);
      me.energy -= energyCost;
    },
    flywalk: (energyCost, animationName) => {
      animationName = animationName || "fly";
      me.animation.push({
        name: animationName,
        fromX: me.x,
        fromY: me.y,
      });
      en.move(game, me, target.x, target.y);
      me.energy -= energyCost;
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
      if (xto === undefined || yto === undefined) {
        xto = target.x;
        yto = target.y;
      }
      en.move(game, me, xto, yto);
    },
    spoil: (name, x, y, data, team) => {
      return en.addSpoil(game, name, x, y, data, team);
    },
    clearspoil: (x, y, name) => {
      for (i = game.spoil.length; i--; i > 0) {
        if (game.spoil[i].name == name && game.spoil[i].x == x && game.spoil[i].y == y)
          game.spoil.splice(i, 1);
      }
    },
    addStatus: (st, x, y) => {
      if (_.isFinite(x) && _.isFinite(y)) en.addStatus(en.unitInPoint(game, x, y), st);
      else en.addStatus(target.unit, st);
    },
    addUnit: (tp, x, y, team) => {
      if (!_.isFinite(x) || !_.isFinite(x)) {
        x = target.x;
        y = target.y;
      }
      if (!team) team = game.turn;
      if (!en.unitInPoint(game, x, y) && en.inField(x, y)) {
        let u = en.addUnit(game, tp, x, y, team);
        // console.log('in wrapper game.appearPool', game.appearPool);
        return u;
      }
    },
    addTrail: (name, unit, x, y, turn) => {
      if (x == undefined) x = target.x;
      if (y == undefined) y = target.y;
      unit = unit || target.unit;
      game.trail.push({
        name,
        x,
        y,
        data: { unit },
        turn: turn || 0,
      });
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
          tp == "base"
        );
        unit.tp = tp;
      }
      game.trail.push({ img: "polymorph", x, y });
    },
    terraform: (x, y, terrain) => {
      console.log(game.field[x][y]);
      if (game.field[x][y].slice(0, -1) != "team") game.field[x][y] = terrain;
      console.log(game.field[x][y]);
    },
    animatePunch: () => {
      me.animation.push({ name: "punch", targetX: target.x, targetY: target.y });
    },
  };
};
