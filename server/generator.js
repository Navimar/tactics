const meta = require('./meta');
const en = require('./engine');

// const barraks = require('./barraks');
const _ = require('lodash');

let barraks = {};
Object.keys(meta).forEach(function (key) {
  let val = meta[key];
  if (barraks[val.class]) {
    barraks[val.class].push(key);
  } else {
    barraks[val.class] = [key];
  }
});

exports.new = () => {
  let makeUnit = (tp, x, y, team) => {
    let life = meta[tp].life;
    return en.makeUnit(tp, x, y, team, life)
  }
  let rndUnit = () => {
    let chance = [];
    // _.times(7, () => chance.push(barraks.hero));
    _.times(7, () => chance.push(barraks.champion));
    _.times(1, () => chance.push(barraks.support));
    return _.sample(_.sample(chance));
  }
  let c = 0;
  let data = {
    unit: [],
    field: [],
  };
  for (let x = 0; x < 9; x++) {
    data.field[x] = [];
    for (let y = 0; y < 9; y++) {
      data.field[x][y] = 'grass';
    }
  }
  data.field[1][1] = 'team' + rndTeam();
  data.field[1][7] = 'team' + rndTeam();
  data.field[4][4] = 'team' + rndTeam();
  data.field[7][7] = 'team' + rndTeam();
  data.field[7][1] = 'team' + rndTeam();

  let points = []

  let neutralarr = []
  let orangearr = []
  let bluearr = []
  let nq = _.random(7)

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y, type:[0, 1, 2, 3], });
    }
  }
  points = _.sampleSize(points, 81);
  points.forEach(p => {
    let notblue, notorange, notneutral = false;

    bluearr.forEach(e => {
      if ((e.x == p.x && e.y == p.y)
        || (Math.abs(e.x + e.y - (p.x + p.y)) > 8)
        || bluearr.length == 7 || bluearr.length > orangearr.length) notblue = true;
      if (Math.abs(e.x + e.y - (p.x + p.y)) < 5)
        notorange = true
    });
    orangearr.forEach(e => {
      if ((e.x == p.x && e.y == p.y) ||
        (Math.abs(e.x + e.y - (p.x + p.y)) > 8) ||
        orangearr.length == 7 || bluearr.length < orangearr.length) notorange = true;
      if (Math.abs(e.x + e.y - (p.x + p.y)) < 5)
        notblue = true

    });
    let arr = []
    if (neutralarr.length<nq)
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
    console.log(p.type)
    if (p.type == 3) {
      data.unit.push(makeUnit('mashroom', p.x, p.y, p.type));
      neutralarr.push({ x: p.x, y: p.y })
    }
    else if (p.type == 1) {
      data.unit.push(makeUnit(rndUnit(), p.x, p.y, p.type));
      bluearr.push({ x: p.x, y: p.y })
    }
    else if (p.type == 2) {
      data.unit.push(makeUnit(rndUnit(), p.x, p.y, p.type));
      orangearr.push({ x: p.x, y: p.y })
    }

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
