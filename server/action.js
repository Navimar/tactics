const en = require("./engine");
const _ = require("lodash");
const meta = require("./meta");

exports.teleport = (wd) => {
  wd.me.animation.push({ name: "teleport", fromX: wd.me.x, fromY: wd.me.y });
  wd.go(wd.target.x, wd.target.y);
  if (wd.me.status.includes("teleporter")) {
    wd.me.status.remove("teleporter");
    wd.tire();
  }
};

exports.kill = (wd, turn) => {
  wd.kill();
  wd.addTrail("death", wd.target.unit, wd.target.x, wd.target.y, turn);
  wd.tire();
};

exports.disappear = (wd, turn) => {
  wd.disappear();
  wd.addTrail("disappear", wd.target.unit, wd.target.x, wd.target.y, turn);
  wd.tire();
};

exports.polymorph = (wd) => {
  wd.animatePunch();
  wd.target.unit.animation.push({ name: "polymorph", img: meta[wd.target.unit.tp].img(wd) });
  wd.polymorph();
  wd.tire();
};

exports.wound = (wd) => {
  if (wd.target.unit.status.includes("wound2")) {
    wd.game.trail.push({
      name: "death",
      x: wd.target.x,
      y: wd.target.y,
      data: { unit: wd.target.unit },
      turn: 0,
    });
    wd.kill();
  } else if (wd.target.unit.status.includes("wound")) {
    wd.target.unit.status.remove("wound");
    wd.addStatus("wound2");
  } else wd.addStatus("wound");
  wd.tire();
  wd.target.unit.animation.push({ name: "shake" });
  wd.animatePunch();
};

exports.capture = (wd) => {
  wd.animatePunch();
  wd.target.unit.team = wd.game.turn;
  wd.tire();
};

exports.move = (wd, data) => {
  wd.walk(data.energyCost);
};
