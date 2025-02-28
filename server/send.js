import _ from "lodash";
import meta from "./meta.js";

import wrapper from "./wrapper.js";
import dotenv from "dotenv";
dotenv.config();

import player from "./player.js";

const exports = {};
exports.web = (p, game) => {
  msg = game.data;
  event = "update";
  p.socket.emit(event, msg);
};

exports.bot = (id, text, bot) => {
  bot.telegram.sendMessage(id, text).catch((error) => {
    console.log(error);
    if (error.response.error_code == 403) {
      player.stop(player.byId(id));
    }
  });
};
exports.botPhoto = (id, src, bot) => {
  bot.telegram.sendPhoto(id, src);
};

exports.gamelist = (id, p, bot) => {
  let key = player.setKey(p);
  let text = "";
  p.game.forEach((e) => {
    if (e.ai == "mission") text += "Выживание: ";
    else if (e.ai == "ai") text += "Против компьютера: ";
    else if (e.sandbox) text += "Песочница: ";
    else {
      if ((e.bonus[1] == null && e.players[0].id) || (e.bonus[2] == null && e.players[1].id)) {
        text += "НОВАЯ ИГРА!!! ";
      }
      if ((e.turn == 1 && id == e.players[0].id) || (e.turn == 2 && id == e.players[1].id))
        text += "ВАШ ХОД!!! ";
      let firstplayer = e.players[0].username || e.players[0].id;
      let secondplayer = e.players[1].username || e.players[1].id;
      text += firstplayer + " vs " + secondplayer + " ";
    }
    text += process.env.DOMAIN + "/?id=" + id + "&key=" + key + "u" + "&game=" + e.id + "\n";
  });
  if (text == "")
    text = "Нет активных игр\n/sandbox чтобы играть самому с собой\n/find чтобы найти соперника";
  else text = `Список активных игр:\n` + text;
  bot.telegram.sendMessage(id, text);
};

exports.loginError = (socket, error) => {
  socket.emit("login", error);
};

exports.successfulLogin = (socket) => {
  socket.emit("login", "success");
};

exports.data = (game) => {
  let getData = (game, player) => {
    let send = {
      sandbox: game.sandbox,
      frame: (() => {
        if (!game.sandbox && player == 2) return game.frame.length - 1;
        else return game.frame.length;
      })(),
      keyframe: game.keyframe,
      sticker: game.sticker,
      spoil: (() => {
        let arr = [];
        game.spoil.forEach((s) => {
          // console.log(s.team,player);
          if (s.team == player || s.team == 3) arr.push(s);
        });
        return arr;
      })(),
      finished: game.finished,
      leftturns: game.leftturns,
      chooseteam: game.chooseteam,
      trail: [],
      bonus: (() => {
        if (game.bonus[3 - player] === null) return "choose";
        if (game.bonus[1] !== null && game.bonus[2] !== null) return "ready";
        if (game.bonus[3 - player] !== null) return "wait";
      })(),
      win: (() => {
        if (game.winner != 0) {
          if (player == game.winner) {
            return "win";
          } else {
            return "defeat";
          }
        }
        return false;
      })(),
      field: (() => {
        let arr = [];
        for (let x = 0; x < 9; x++) {
          arr[x] = [];
          for (let y = 0; y < 9; y++) {
            arr[x][y] = game.field[x][y];
            if (player == 2) {
              if (game.field[x][y] == "team1") arr[x][y] = "team2";
              if (game.field[x][y] == "team2") arr[x][y] = "team1";
            }
          }
        }
        return arr;
      })(),
      unit: [],
      gold: (() => {
        if (player == 1) return game.gold.slice();
        if (player == 2) return game.gold.slice().reverse();
      })(),
      fisher: (() => {
        if (player == 1) return game.fisher;
        if (player == 2) return game.fisher.slice().reverse();
      })(),
      turn: (() => {
        if (game.turn == player) return true;
        else return false;
      })(),
    };
    game.trail.forEach((tr) => {
      let unit = tr.unit;
      let sendunit = false;
      if (unit) {
        sendunit = {
          x: unit.x,
          y: unit.y,
          m: unit.m,
          status: unit.status.slice(),
          isActive: unit.isActive,
          isReady: unit.isReady,
          img: meta[unit.tp].img(wrapper(game, unit, unit)),
          sticker: unit.sticker
            ? {
                img: meta[unit.sticker.tp].img(wrapper(game, unit, unit)),
                color: (() => {
                  if (player == 1) return unit.sticker.team;
                  if (player == 2)
                    return (() => {
                      if (unit.sticker.team == 1) {
                        return 2;
                      } else if (unit.sticker.team == 2) {
                        return 1;
                      } else return unit.sticker.team;
                    })();
                })(),
              }
            : false,
          color: (() => {
            if (player == 1) return unit.team;
            if (player == 2)
              return (() => {
                if (unit.team == 1) {
                  return 2;
                } else if (unit.team == 2) {
                  return 1;
                } else return unit.team;
              })();
          })(),
        };
      }
      send.trail.push({ ...tr, unit: sendunit });
    });

    game.unit.forEach((u) => {
      send.unit.push({
        img: _.isFunction(meta[u.tp].img) ? meta[u.tp].img(wrapper(game, u, u)) : meta[u.tp].img,
        tp: u.tp,
        status: u.status.slice(),
        isActive: u.isActive,
        isReady: u.isReady,
        description: meta[u.tp].description,
        name: meta[u.tp].name,
        m: u.m,
        x: u.x,
        y: u.y,
        team: u.team,
        animation: u.animation,
        sticker: u.sticker
          ? {
              img: _.isFunction(meta[u.sticker.tp].img)
                ? meta[u.sticker.tp].img(wrapper(game, u, u))
                : meta[u.sticker.tp].img,
              color: (() => {
                if (player == 1) return u.sticker.team;
                if (player == 2)
                  return (() => {
                    if (u.sticker.team == 1) {
                      return 2;
                    } else if (u.sticker.team == 2) {
                      return 1;
                    } else return u.sticker.team;
                  })();
              })(),
            }
          : false,
        akt: (() => {
          // if (u.team == player) return u.akt;
          // else return [];
          return u.akt;
        })(),
        color: (() => {
          if (player == 1) return u.team;
          if (player == 2)
            return (() => {
              if (u.team == 1) {
                return 2;
              } else if (u.team == 2) {
                return 1;
              } else return u.team;
            })();
        })(),
        canMove: (() => {
          if ((game.chooseteam && u.team != 3) || u.team == player || u.status.includes("telepath"))
            return true;
          return false;
        })(),
      });
    });
    if (game.sandbox) game.frame.push(send);
    else if (player == 1) game.frame.push([send, null]);
    else if (player == 2) game.frame[game.frame.length - 1][1] = send;
    return send;
  };
  if (game) {
    let p0socket = game.players[0].socket.get(game.id);
    if (game.ai && p0socket) {
      p0socket.emit("update", { data: getData(game, 1), history: false });
    } else if (game.sandbox && p0socket) {
      p0socket.emit("update", { data: getData(game, game.turn), history: false });
    } else {
      let p1socket = game.players[1].socket.get(game.id);
      let d1 = getData(game, 1);
      let d2 = getData(game, 2);
      if (p0socket) p0socket.emit("update", { data: d1, history: false });
      if (p1socket) p1socket.emit("update", { data: d2, history: false });
    }
  }
};

exports.frame = (game, p, f) => {
  let n = player.number(game, p);
  let p0socket = game.players[n - 1].socket.get(game.id);
  if (game.sandbox) {
    if (game.frame[f]) p0socket.emit("update", { data: game.frame[f], history: true });
    else p0socket.emit("update", { data: game.frame[game.frame.length - 1], history: false });
  } else {
    if (game.frame[f]) {
      if (game.frame[f][n - 1])
        p0socket.emit("update", { data: game.frame[f][n - 1], history: true });
    } else if (game.frame[game.frame.length - 1][n - 1])
      p0socket.emit("update", { data: game.frame[game.frame.length - 1][n - 1], history: false });
    else
      p0socket.emit("update", { data: game.frame[game.frame.length - 2][n - 1], history: false });
  }
};

exports.logicerror = (game, error) => {
  game.players[0].socket.get(game.id).emit("logic", error);
  game.players[1].socket.get(game.id).emit("logic", error);
};

export default exports;
