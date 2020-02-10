const meta = require('./meta');
const en = require('./engine');

// const barraks = require('./barraks');
const _ = require('lodash');

let barraks = [];
Object.keys(meta).forEach(function (key) {
  _.times(meta[key].weight, () => barraks.push(key));
});

exports.new = () => {
  let makeUnit = (tp, x, y, team) => {
    let life = meta[tp].life;
    return en.makeUnit(tp, x, y, team, life)
  }
  let rndUnit = () => {
    return _.sample(barraks);
  }
  let c = 0;
  let data = {
    unit: [],
    field: [],
  };
  for (let x = 0; x < 9; x++) {
    data.field[x] = [];
    for (let y = 0; y < 9; y++) {
      data.field[x][y] = 'none';
    }
  }
  let points = []

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y, type: [0, 1, 2, 3], });
    }
  }
  points = _.sampleSize(points, 81);

  points.forEach(p => {
    let ground = 1
    let grass = 1
    let n = 3
    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'ground') ground += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'ground') ground += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'ground') ground += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'ground') ground += n;

    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'grass') grass += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'grass') grass += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'grass') grass += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'grass') grass += n;

    if (_.random(ground + grass - 1) < ground)
      data.field[p.x][p.y] = 'ground'
    else
      data.field[p.x][p.y] = 'grass'
  });


  // data.field[1][1] = 'team' + rndTeam();
  // data.field[1][7] = 'team' + rndTeam();
  // data.field[4][4] = 'team' + rndTeam();
  // data.field[7][7] = 'team' + rndTeam();
  // data.field[7][1] = 'team' + rndTeam();
  data.field[2][2] = 'team' + rndTeam();
  data.field[2][6] = 'team' + rndTeam();
  data.field[4][4] = 'team' + rndTeam();
  data.field[6][6] = 'team' + rndTeam();
  data.field[6][2] = 'team' + rndTeam();

  points = []

  let neutralarr = []
  let orangearr = []
  let bluearr = []
  let nq = _.random(7)
  let maxunit = 91;
  let maxpop = 3;

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y, type: [0, 1, 2, 3], });
    }
  }
  points = _.sampleSize(points, 81);
  points.forEach(p => {
    let notblue, notorange, notneutral = false;
    let pop = 0;

    if (p.x < 1 || p.x > 2) notorange = true
    if (p.x < 6 || p.x > 7) notblue = true
    if (p.y == 0 || p.y == 8) {
      notorange = true
      notblue = true
    }
    bluearr.forEach(e => {
      if (
        // (e.x == p.x && e.y == p.y)
        // || (Math.abs(e.x + e.y - (p.x + p.y)) > 15)
        // || bluearr.length == maxunit
        // ||
        bluearr.length > orangearr.length
      )
        notblue = true;
      // if (Math.abs(e.x + e.y - (p.x + p.y)) < 4)
      //   // notorange = true
      if (Math.abs(e.x + e.y - (p.x + p.y)) < 3) {
        pop++
      }
    });
    if (pop > maxpop)
      notblue = true;

    pop = 0;
    orangearr.forEach(e => {
      if (
        // (e.x == p.x && e.y == p.y) ||
        //     (Math.abs(e.x + e.y - (p.x + p.y)) > 15) ||
        //     orangearr.length == maxunit
        //  ||
        bluearr.length < orangearr.length
      ) notorange = true;
      //   if (Math.abs(e.x + e.y - (p.x + p.y)) < 4)
      //     // notblue = true
      if (Math.abs(e.x + e.y - (p.x + p.y)) < 3) {
        pop++
      }
    });
    if (pop > maxpop)
      notorange = true;

    if (neutralarr.length < nq)
      neutralarr.forEach(e => {
        if ((e.x == p.x && e.y == p.y)) {
          notneutral = true;
        }
      }); else
      notneutral = true;

    if (notblue) p.type.remove(1);
    if (notorange) p.type.remove(2);
    if (notneutral) p.type.remove(3);

    if (p.type.length > 1) p.type.remove(0);
    p.type = _.sample(p.type);
    if (p.type == 3) {
      data.unit.push(makeUnit('mashroom', p.x, p.y, p.type));
      neutralarr.push({ x: p.x, y: p.y })
    }
    else if (p.type == 1) {
      bluearr.push({ x: p.x, y: p.y })
    }
    else if (p.type == 2) {
      orangearr.push({ x: p.x, y: p.y })
    }

  });
  if (bluearr.length - orangearr.length > 0)
    bluearr.pop()
  if (bluearr.length - orangearr.length < 0)
    orangearr.pop()

  bluearr.forEach(e => {
    data.unit.push(makeUnit(rndUnit(), e.x, e.y, 1));
  });
  orangearr.forEach(e => {
    data.unit.push(makeUnit(rndUnit(), e.x, e.y, 2));

  });
  return data

}
//   let t1p;
//   do {
//     t1p = _.sample(points)
//     c++;

//   } while (!(t1p.x == 0 || t1p.x == 8 || t1p.y == 0 || t1p.y == 8) && c < 1000);
//   data.unit.push(makeUnit(rndUnit(), t1p.x, t1p.y, 1));


//   do {
//     t2p = _.sample(points)
//     c++;

//   } while (!(t2p.x == 0 || t2p.x == 8 || t2p.y == 0 || t2p.y == 8) || Math.abs(t2p.x + t2p.y - (t1p.x + t1p.y)) < 4 && c < 1000);
//   data.unit.push(makeUnit(rndUnit(), t2p.x, t2p.y, 2));

//   t1p = [t1p]
//   t2p = [t2p]
//   _.times(6, (n) => {
//     c = 0
//     let np = _.sample(points)
//     let near
//     do {
//       np = _.sample(points)
//       near = false
//       t1p.forEach(e => {
//         // console.log(e.x, e.y, np.x, np.y)
//         if (Math.abs(e.x + e.y - (np.x + np.y)) < 4) {
//           near = true
//         }
//       });
//       t2p.forEach(e => {
//         if ((e.x == np.x && e.y == np.y) || (Math.abs(e.x + e.y - (np.x + np.y)) > 8)) near = true;
//       });
//       c++;

//     } while (near && c < 1000)
//     data.unit.push(makeUnit(rndUnit(), np.x, np.y, 2));
//     t2p.push({ x: np.x, y: np.y });

//     np = _.sample(points)
//     near
//     do {
//       np = _.sample(points)
//       near = false
//       t2p.forEach(e => {
//         // console.log(e.x, e.y, np.x, np.y)
//         if (Math.abs(e.x + e.y - (np.x + np.y)) < 4) {
//           near = true
//         }
//       });
//       t1p.forEach(e => {
//         if ((e.x == np.x && e.y == np.y) || (Math.abs(e.x + e.y - (np.x + np.y)) > 8)) near = true;
//       });
//       c++;

//     } while (near && c < 1000)
//     data.unit.push(makeUnit(rndUnit(), np.x, np.y, 1));
//     t1p.push({ x: np.x, y: np.y });
//   });
//   let tnp = [];
//   _.times(_.random(7), (n) => {
//     do {
//       np = _.sample(points)
//       near = false
//       t1p.forEach(e => {
//         if (e.x == np.x && e.y == np.y) near = true;
//       });
//       t2p.forEach(e => {
//         if (e.x == np.x && e.y == np.y) near = true;
//       });
//       tnp.forEach(e => {
//         if (e.x == np.x && e.y == np.y) near = true;
//       });
//       c++;
//     } while (near && c < 1000)
//     data.unit.push(makeUnit('mashroom', np.x, np.y, 3));
//     tnp.push({ x: np.x, y: np.y });
//   });
//   return data
// }

// let makeUnit = (tp, x, y, team) => {
//   let life = meta[tp].life;
//   return en.makeUnit(tp, x, y, team, life)
// }

// let rndUnit = () => {
//   let chance = [];
//   // _.times(7, () => chance.push(barraks.hero));
//   _.times(7, () => chance.push(barraks.champion));
//   _.times(1, () => chance.push(barraks.support));
//   return _.sample(_.sample(chance));
// }

let rndTeam = () => {
  return (Math.random() >= 0.5) ? 1 : 2;
}
