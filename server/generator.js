const meta = require('./meta');
const en = require('./engine');

// const barraks = require('./barraks');
const _ = require('lodash');

exports.new = (rank) => {
  rank =9999
  let barraks = [];
  Object.keys(meta).forEach(function (key) {
    if (!meta[key].neutral && meta[key].rank <= rank)
      _.times(meta[key].weight, () => barraks.push(key));
  });
  let warrior = [];
  let archer = [];
  let spec = [];
  Object.keys(meta).forEach(function (key) {
    if (!meta[key].neutral && meta[key].rank <= rank) {
      if (meta[key].class == 'warrior')
        warrior.push(key)
      if (meta[key].class == 'archer')
        archer.push(key)
      if (meta[key].class == 'spec')
        spec.push(key)
    }
  });

  // barraks = barraks.sort(function () {
  //   return Math.random() - 0.5;
  // });
  // barraks=barraks.slice(0, 3);

  let neutrals = [];
  Object.keys(meta).forEach(function (key) {
    if (meta[key].neutral && meta[key].rank <= rank)
      _.times(meta[key].weight, () => neutrals.push(key));
  });

  let makeUnit = (tp, x, y, team) => {
    // let life = meta[tp].life;
    return en.makeUnit(tp, x, y, team)
  }
  let rndUnit = () => {
    return _.sample(barraks);
  }
  let rndNeutral = () => {
    return _.sample(neutrals);
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
    let ground = _.random(10)
    let grass = _.random(70)
    let n = _.random(500)
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

  // let neutralarr = []
  // let orangearr = []
  // let bluearr = []
  // let nq = _.random(9)
  // let maxunit = 91;
  // let maxpop = 2;

  // for (let y = 0; y < 9; y++) {
  //   for (let x = 0; x < 9; x++) {
  //     points.push({ x, y, type: [0, 1, 2, 3], });
  //   }
  // }
  // points = _.sampleSize(points, 81);
  // points.forEach(p => {
  //   let notblue, notorange, notneutral = false;
  //   let pop = 0;

  //   if (p.x < 1 || p.x > 2) notorange = true
  //   if (p.x < 6 || p.x > 7) notblue = true
  //   if (p.y == 0 || p.y == 8) {
  //     notorange = true
  //     notblue = true
  //   }
  //   bluearr.forEach(e => {
  //     if (
  //       // (e.x == p.x && e.y == p.y)
  //       // || (Math.abs(e.x + e.y - (p.x + p.y)) > 15)
  //       // || bluearr.length == maxunit
  //       // ||
  //       bluearr.length > orangearr.length
  //     )
  //       notblue = true;
  //     // if (Math.abs(e.x + e.y - (p.x + p.y)) < 4)
  //     //   // notorange = true
  //     if (Math.abs(e.x + e.y - (p.x + p.y)) < 3) {
  //       pop++
  //     }
  //   });
  //   if (pop > maxpop)
  //     notblue = true;

  //   pop = 0;
  //   orangearr.forEach(e => {
  //     if (
  //       // (e.x == p.x && e.y == p.y) ||
  //       //     (Math.abs(e.x + e.y - (p.x + p.y)) > 15) ||
  //       //     orangearr.length == maxunit
  //       //  ||
  //       bluearr.length < orangearr.length
  //     ) notorange = true;
  //     //   if (Math.abs(e.x + e.y - (p.x + p.y)) < 4)
  //     //     // notblue = true
  //     if (Math.abs(e.x + e.y - (p.x + p.y)) < 3) {
  //       pop++
  //     }
  //   });
  //   if (pop > maxpop)
  //     notorange = true;

  //   if (neutralarr.length < nq)
  //     neutralarr.forEach(e => {
  //       if ((e.x == p.x && e.y == p.y)) {
  //         notneutral = true;
  //       }
  //     }); else
  //     notneutral = true;

  //   if (notblue) p.type.remove(1);
  //   if (notorange) p.type.remove(2);
  //   if (notneutral) p.type.remove(3);

  //   if (p.type.length > 1) p.type.remove(0);
  //   p.type = _.sample(p.type);
  //   if (p.type == 3) {
  //     data.unit.push(makeUnit(rndNeutral(), p.x, p.y, p.type));
  //     neutralarr.push({ x: p.x, y: p.y })
  //   }
  //   else if (p.type == 1) {
  //     bluearr.push({ x: p.x, y: p.y })
  //   }
  //   else if (p.type == 2) {
  //     orangearr.push({ x: p.x, y: p.y })
  //   }

  // });
  // if (bluearr.length - orangearr.length > 0)
  //   bluearr.pop()
  // if (bluearr.length - orangearr.length < 0)
  //   orangearr.pop()
  let bluearr = []
  for (let y = 1; y < 8; y++) {
    for (let x = 1; x < 3; x++) {
      bluearr.push({ x, y });
    }
  }
  bluearr = _.sampleSize(bluearr, 9);

  let orangearr = []
  for (let y = 1; y < 8; y++) {
    for (let x = 6; x < 8; x++) {
      orangearr.push({ x, y });
    }
  }
  orangearr = _.sampleSize(orangearr, 9);


  // let w = _.sample(warrior)
  // let a = _.sample(archer)
  // let s = _.sample(spec);

  bluearr[0].tp = _.sample(warrior);
  bluearr[1].tp = _.sample(warrior);
  bluearr[2].tp = _.sample(warrior);
  bluearr[3].tp = _.sample(archer);
  bluearr[4].tp = _.sample(archer);
  bluearr[5].tp = _.sample(spec);
  bluearr[6].tp = _.sample(archer);
  bluearr[7].tp = _.sample(warrior);
  bluearr[8].tp = _.sample(spec);

  // w = _.sample(warrior);
  // a = _.sample(archer);
  // s = _.sample(spec);

  orangearr[0].tp = _.sample(warrior);
  orangearr[1].tp = _.sample(warrior);
  orangearr[2].tp = _.sample(warrior);
  orangearr[3].tp = _.sample(archer);
  orangearr[4].tp = _.sample(archer);
  orangearr[5].tp = _.sample(spec);
  orangearr[6].tp = _.sample(archer);
  orangearr[7].tp = _.sample(warrior);
  orangearr[8].tp = _.sample(spec);

  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if ((x < 1 || x > 2) && (x < 6 || x > 7) || y < 1 || y > 7)
        points.push({ x, y, tp: rndNeutral() });
    }
  }
  points = _.sampleSize(points, _.random(9));

  bluearr.forEach(e => {
    data.unit.push(makeUnit(e.tp || 'chiken', e.x, e.y, 1));
  });
  orangearr.forEach(e => {
    data.unit.push(makeUnit(e.tp || 'chiken', e.x, e.y, 2));
  });
  points.forEach(e => {
    data.unit.push(makeUnit(e.tp, e.x, e.y, 3));
  });

  return data

}

let rndTeam = () => {
  return (Math.random() >= 0.5) ? 1 : 2;
}
