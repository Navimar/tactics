const meta = require('./meta');
const en = require('./engine');

// const barraks = require('./barraks');
const _ = require('lodash');

exports.new = (rank) => {
  rank = 9999
  let barraks = [];
  Object.keys(meta).forEach(function (key) {
    if (!meta[key].neutral && meta[key].rank <= rank)
      if (meta[key].weight)
      barraks.push(key)
      // _.times(meta[key].weight, () => barraks.push(key));
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


  // let defground = _.random(10)
  // let defgrass = _.random(70)
  // let defsky =  _.random(15)
  // let n = _.random(500)
  let defground = 5
  let defgrass = 5
  let defsky = 0
  let defmountain = 0
  let n = 999999
  points.forEach(p => {
    let ground = defground
    let grass = defgrass
    let mountain = defmountain
    let sky = defsky
    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'ground') ground += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'ground') ground += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'ground') ground += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'ground') ground += n;

    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'grass') grass += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'grass') grass += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'grass') grass += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'grass') grass += n;

    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'sky') sky += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'sky') sky += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'sky') sky += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'sky') sky += n;

    if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'mountain') mountain += n;
    if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'mountain') mountain += n;
    if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'mountain') mountain += n;
    if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'mountain') mountain += n;

    let r = _.random(ground + grass + sky + mountain)
    if (r <= ground)
      data.field[p.x][p.y] = 'ground'
    else if (r > ground && r <= ground + grass)
      data.field[p.x][p.y] = 'grass'
    else if (r > ground + grass && r <= ground + grass + sky)
      data.field[p.x][p.y] = 'sky'
    else if (r > ground + grass + sky && r <= ground + grass + sky+mountain)
      data.field[p.x][p.y] = 'mountain'

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

  // bluearr[0].tp = _.sample(warrior);
  // bluearr[1].tp = _.sample(warrior);
  // bluearr[2].tp = _.sample(warrior);
  // bluearr[3].tp = _.sample(archer);
  // bluearr[4].tp = _.sample(archer);
  // bluearr[5].tp = _.sample(spec);
  // bluearr[6].tp = _.sample(archer);
  // bluearr[7].tp = _.sample(warrior);
  // bluearr[8].tp = _.sample(spec);

  // orangearr[0].tp = _.sample(warrior);
  // orangearr[1].tp = _.sample(warrior);
  // orangearr[2].tp = _.sample(warrior);
  // orangearr[3].tp = _.sample(archer);
  // orangearr[4].tp = _.sample(archer);
  // orangearr[5].tp = _.sample(spec);
  // orangearr[6].tp = _.sample(archer);
  // orangearr[7].tp = _.sample(warrior);
  // orangearr[8].tp = _.sample(spec);

  barraks = _.shuffle(barraks);
  bluearr[0].tp = barraks[0]
  bluearr[1].tp = barraks[1]
  bluearr[2].tp = barraks[2]
  bluearr[3].tp = barraks[3]
  bluearr[4].tp = barraks[4]
  bluearr[5].tp = barraks[5]
  bluearr[6].tp = barraks[6]
  bluearr[7].tp = barraks[7]
  bluearr[8].tp = barraks[8]

  barraks = _.shuffle(barraks);

  orangearr[1].tp = barraks[0]
  orangearr[2].tp = barraks[1]
  orangearr[3].tp = barraks[2]
  orangearr[0].tp = barraks[3]
  orangearr[4].tp = barraks[4]
  orangearr[5].tp = barraks[5]
  orangearr[6].tp = barraks[6]
  orangearr[7].tp = barraks[7]
  orangearr[8].tp = barraks[8]

  // bluearr[0].tp = _.sample(barraks);
  // bluearr[1].tp = _.sample(barraks);
  // bluearr[2].tp = _.sample(barraks);
  // bluearr[3].tp = _.sample(barraks);
  // bluearr[4].tp = _.sample(barraks);
  // bluearr[5].tp = _.sample(barraks);
  // bluearr[6].tp = _.sample(barraks);
  // bluearr[7].tp = _.sample(barraks);
  // bluearr[8].tp = _.sample(barraks);

  // orangearr[0].tp = _.sample(barraks);
  // orangearr[1].tp = _.sample(barraks);
  // orangearr[2].tp = _.sample(barraks);
  // orangearr[3].tp = _.sample(barraks);
  // orangearr[4].tp = _.sample(barraks);
  // orangearr[5].tp = _.sample(barraks);
  // orangearr[6].tp = _.sample(barraks);
  // orangearr[7].tp = _.sample(barraks);
  // orangearr[8].tp = _.sample(barraks);

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
