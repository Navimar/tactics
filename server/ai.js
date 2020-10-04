

const game = require('./game');
const _ = require('lodash');
const en = require('./engine');
const { sortBy } = require('lodash');


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

    gm.unit.forEach(u => {
      if (u.team == number) {
        if (u.akt.length>0) {
          let zakt = () => {
            return u.akt.filter((a) => {
              return a.img == 'zombie' && en.unitInPoint(gm, a.x, a.y).team != number && en.unitInPoint(gm, a.x, a.y).team != 3
            });
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
      }
    });
    let x = 8
    let y = _.random(9)
    if (!en.isOccupied(gm, x, y))
      game.order(gm, "zombie",
        {
          img: "build",
          x,
          y,
        });

    game.endturn(gm, number);

  }
}