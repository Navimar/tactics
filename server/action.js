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
  wd.addTrail("death", turn, wd.target.unit, wd.target.x, wd.target.y);
  wd.tire();
};

exports.disappear = (wd, turn) => {
  wd.disappear();
  wd.addTrail("disappear", turn, wd.target.unit, wd.target.x, wd.target.y);
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
    wd.addTrail("death");
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

exports.stazis = (wd) => {
  wd.animatePunch();
  if (wd.target.unit.status.includes("stazis")) wd.target.unit.status.remove("stazis");
  else wd.addStatus("stazis");
  wd.tire();
};
