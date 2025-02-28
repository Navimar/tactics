import _ from "lodash";
import { findGetParameter } from "./util.js";

export const data = {
  fisher: ["???", "!!!"],
  leftturns: "нет подключения к серверу",
  trail: [],
  spoil: [],
  gold: [11, 11],
  unit: [],
};

export const system = {
  shiftX: 0,
  shiftY: 0,
  dh: 0,
  tapDown: false,
  orientation: "h",
  mouseCell: { x: 0, y: 0 },
};

export const local = {
  time: 0,
  description: {},
  seconds: 0,
  lastclick: 0,
  newAnimationTurn: 0,
  animationTurn: 0,
  akt: [],
  focus: false,
  position: { p1: 0, p2: 0 },
  fisher: [999, 999],
  sandclock: { x: 0, y: 0 },
  spoilmask: _.times(9, () => _.times(9, () => _.random(1, 1000))),
  tip: {
    text: "Подключение к серверу...",
    x: 3,
    y: 3,
    color: "#F00",
    font: 300,
    dur: 30,
  },
  turn: 1,
  gameid: findGetParameter("game"),
  frame: 0,
  unitencn: 9,
  unitcn: 9,
  cost: 5,
  rise: false,
  cadr: 0,
};
