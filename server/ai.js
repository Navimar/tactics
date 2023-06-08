

const game = require('./game');
const _ = require('lodash');
const en = require('./engine');

exports.go = (gm, number) => {
  if (gm.turn == number) {

    let imp = []
    for (let y = 0; y < 9; y++) {
      imp[y] = [];
      for (let x = 0; x < 9; x++) {
        imp[y][x] = 0;
      }
    }

    gm.unit.forEach(u => {
      if (u.team != number && u.team != 3)
        u.akt.forEach(a => {
          imp[a.x][a.y]++
        });
    });

    let zcn = 0;
    gm.unit.forEach(u => {
      u = { ...u }
      if (u.team == number) {
        if (u.tp == 'firebat') {
          zcn++;
          if (u.akt.length > 0) {
            let zakt = () => {
              let arr = u.akt.filter((a) => {
                return a.img == 'firebat' && en.unitInPoint(gm, a.x, a.y).team != number && en.unitInPoint(gm, a.x, a.y).team != 3
              });
              return arr
            }
            let makt = () => {
              let r = u.akt.filter((a) => a.img == 'move');
              return r.sort((a, b) => imp[b.x][b.y] - imp[a.x][a.y]);
            }

            if (zakt().length > 0)
              game.order(gm, u, _.sample(zakt()));
            else if (makt().length > 0) {
              game.order(gm, u, makt()[0]);
              if (zakt().length > 0)
                game.order(gm, u, _.sample(zakt()));
            }
            else
              game.order(gm, u, _.sample(u.akt))
          }
        } else if (u.tp == 'teleporter') {
          let tarr = u.akt.filter((a) => {
            return a.img == 'teleporter'
          });
          if (tarr.length > 0)
            game.order(gm, u, _.sample(tarr));
          else if (u.akt.length > 0)
            game.order(gm, u, _.sample(u.akt));
        } else if (u.tp == 'worm') {
          if (u.akt.length > 0) {
            let arr = u.akt.sort((a, b) => imp[b.x][b.y] - imp[a.x][a.y]);
            game.order(gm, u, arr[0]);
          }
        } else {
          if (u.akt.length > 0)
            game.order(gm, u, _.sample(u.akt));
        }
      }
    });
    gm.gold[number - 1] += 10;
    let tries = 0
    let tp = 'firebat'
    if (zcn > 15)
      tp = 'base';
    while (gm.gold[number - 1] >= 5 && tries < 10) {
      tries++
      let x = 8
      let y = _.random(9)
      if (!en.isOccupied(gm, x, y))
        game.order(gm, tp,
          {
            img: "build",
            x,
            y,
          });
    }
    game.endturn(gm, number);

  }
}