const meta = require('./meta');
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
  // console.log('new')
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
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      points.push({ x, y });
    }
  }
  let t1p;
  do {
    t1p = _.sample(points)
  } while (!(t1p.x == 0 || t1p.x == 8 || t1p.y == 0 || t1p.y == 8));
  data.unit.push(makeUnit(rndUnit(), t1p.x, t1p.y, 1));


  do {
    t2p = _.sample(points)
  } while (!(t2p.x == 0 || t2p.x == 8 || t2p.y == 0 || t2p.y == 8) || Math.abs(t2p.x + t2p.y - (t1p.x + t1p.y)) < 4);
  data.unit.push(makeUnit(rndUnit(), t2p.x, t2p.y, 2));

  t1p = [t1p]
  t2p = [t2p]
  _.times(6, (n) => {
    let np = _.sample(points)
    let near
    do {
      np = _.sample(points)
      near = false
      t1p.forEach(e => {
        // console.log(e.x, e.y, np.x, np.y)
        if (Math.abs(e.x + e.y - (np.x + np.y)) < 4) {
          near = true
        }
      });
      t2p.forEach(e => {
        if (e.x == np.x && e.y == np.y) near = true;
      });

    } while (near)
    data.unit.push(makeUnit(rndUnit(), np.x, np.y, 2));
    t2p.push({ x: np.x, y: np.y });

    np = _.sample(points)
    near
    do {
      np = _.sample(points)
      near = false
      t2p.forEach(e => {
        // console.log(e.x, e.y, np.x, np.y)
        if (Math.abs(e.x + e.y - (np.x + np.y)) < 4) {
          near = true
        }
      });
      t1p.forEach(e => {
        if (e.x == np.x && e.y == np.y) near = true;
      });
    } while (near)
    data.unit.push(makeUnit(rndUnit(), np.x, np.y, 1));
    t1p.push({ x: np.x, y: np.y });
  });

  return data
}

let makeUnit = (tp, x, y, team, ) => {
  let m = x < 5 ? false : true;
  return {
    isReady: true,
    energy: 3,
    tp,
    m,
    x,
    y,
    data: {},
    team,
    life: meta[tp].life,
  }
}

let rndUnit = () => {
  return _.sample(barraks.champion);
}

let rndTeam = () => {
  return (Math.random() >= 0.5) ? 1 : 2;
}
