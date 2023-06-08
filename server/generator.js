const meta = require('./meta');
const en = require('./engine');

const _ = require('lodash');

exports.new = (rank, ai) => {
  rank = 9999
  let barraks = [];
  Object.keys(meta).forEach(function (key) {
    if (meta[key].rank <= rank)
      if (meta[key].weight)
        if (meta[key].class == 'basic')
          barraks.push(key)
  });
  // barraks = _.sampleSize(barraks, 4);

  let neutral = [];
  Object.keys(meta).forEach(function (key) {
    if (meta[key].rank <= rank)
      if (meta[key].weight)
        if (meta[key].class == 'neutral')
          neutral.push(key)
  });

  let makeUnit = (tp, x, y, team) => {
    return en.makeUnit(tp, x, y, team)
  }
  let rndUnit = () => {
    let i = _.random(barraks.length - 1)
    let r = barraks[i];
    // barraks.splice(i, 1)
    if (r)
      return r
    else
      return 'warrior'
  }

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
  let points = en.allPoints();
  points = _.sampleSize(points, 81);


  // data.field[points[0].x][points[0].y] = 'ground'
  // data.field[points[1].x][points[1].y] = 'ground'

  let defground = 1
  let defgrass = 1
  let defsky = 0
  let defmountain = 0
  let n = 999
  let grasspower = 10000
  let groundpower = 10000


  let dir = 1
  let terrain = ['ground', 'ground', 'grass', 'grass']
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[4 + dir][4] = terrain[0]
  data.field[4 - dir][4] = terrain[1]
  data.field[4][4 + dir] = terrain[2]
  data.field[4][4 - dir] = terrain[3]
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[1 + dir][1] = terrain[0]
  data.field[1][1 - dir] = terrain[1]
  data.field[1][1 + dir] = terrain[2]
  data.field[1 - dir][1] = terrain[3]
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[7 + dir][1] = terrain[0]
  data.field[7 - dir][1] = terrain[1]
  data.field[7][1 + dir] = terrain[2]
  data.field[7][1 - dir] = terrain[3]
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[1 + dir][7] = terrain[0]
  data.field[1 - dir][7] = terrain[1]
  data.field[1][7 + dir] = terrain[2]
  data.field[1][7 - dir] = terrain[3]
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[7 + dir][7] = terrain[0]
  data.field[7 - dir][7] = terrain[1]
  data.field[7][7 + dir] = terrain[2]
  data.field[7][7 - dir] = terrain[3]

  points.forEach(p => {
    if (data.field[p.x][p.y] == 'none') {
      let ground = defground
      let grass = defgrass
      let mountain = defmountain
      let sky = defsky
      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'ground') ground += groundpower;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'ground') ground += groundpower;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'ground') ground += groundpower;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'ground') ground += groundpower;

      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'grass') grass += grasspower;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'grass') grass += grasspower;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'grass') grass += grasspower;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'grass') grass += grasspower;

      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'sky') sky += n;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'sky') sky += n;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'sky') sky += n;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'sky') sky += n;

      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == 'mountain') mountain += n;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == 'mountain') mountain += n;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == 'mountain') mountain += n;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == 'mountain') mountain += n;

      if (ground > grass)
        grass = 0
      if (ground < grass)
        ground = 0

      let r = _.random(ground + grass + sky + mountain - 1)
      if (r < ground)
        data.field[p.x][p.y] = 'ground'
      else if (r >= ground && r < ground + grass)
        data.field[p.x][p.y] = 'grass'
      else if (r >= ground + grass && r < ground + grass + sky)
        data.field[p.x][p.y] = 'sky'
      else if (r >= ground + grass + sky && r < ground + grass + sky + mountain)
        data.field[p.x][p.y] = 'mountain'
    }
  });

  // let makeflag = (px, py, team) => {
  //   let dir = _.random(1) * -2 + 1
  //   if (py < 4)
  //     dir = +1
  //   if (py > 4)
  //     dir = -1

  //   let i = 0
  //   while (
  //     data.field[px][py].slice(0, -1) == 'team'
  //     || data.field[px][py + 1].slice(0, -1) == 'team'
  //     || data.field[px][py - 1].slice(0, -1) == 'team'
  //     || data.field[px - 1][py].slice(0, -1) == 'team'
  //     || data.field[px + 1][py].slice(0, -1) == 'team'
  //     || (
  //       data.field[px][py + 1] == data.field[px][py]
  //       && data.field[px][py - 1] == data.field[px][py]
  //       && data.field[px - 1][py] == data.field[px][py]
  //       && data.field[px + 1][py] == data.field[px][py]
  //       && i++ < 25
  //     )
  //   ) {
  //     py += 1 * dir
  //     if (py >= 7 || py <= 1) {
  //       dir *= -1
  //     }
  //   }
  //   data.field[px][py] = 'team' + team;

  //   if (py <= 5)
  //     dir = -1
  //   else dir = 1
  //   return { x: px, y: py, dir }
  // }
  let makeflag = (px, py, team) => {
    data.field[px][py] = 'team' + team
    return { x: px, y: py, dir: 0 }
  }
  let bluearr = []
  let orangearr = []
  makeflag(4, 4, _.random(1) + 1);
  up = makeflag(1, 1, 1);
  bluearr.push({ x: up.x, y: up.y });
  bluearr.push({ x: up.x - 1, y: up.y });
  bluearr.push({ x: up.x, y: up.y + -1 });
  up = makeflag(1, 7, 1);
  bluearr.push({ x: up.x, y: up.y });
  bluearr.push({ x: up.x - 1, y: up.y });
  bluearr.push({ x: up.x, y: up.y + 1 });
  up = makeflag(7, 1, 2);
  orangearr.push({ x: up.x, y: up.y - 1 });
  orangearr.push({ x: up.x + 1, y: up.y });
  orangearr.push({ x: up.x, y: up.y });
  up = makeflag(7, 7, 2);
  orangearr.push({ x: up.x, y: up.y + 1 });
  orangearr.push({ x: up.x + 1, y: up.y });
  orangearr.push({ x: up.x, y: up.y });

  const pointsnearteam = [
    [4 + dir, 4],
    [4 - dir, 4],
    [4, 4 + dir],
    [4, 4 - dir],
    [1 + dir, 1],
    [1, 1 - dir],
    [1, 1 + dir],
    [1 - dir, 1],
    [7 + dir, 1],
    [7 - dir, 1],
    [7, 1 + dir],
    [7, 1 - dir],
    [1 + dir, 7],
    [1 - dir, 7],
    [1, 7 + dir],
    [1, 7 - dir],
    [7 + dir, 7],
    [7 - dir, 7],
    [7, 7 + dir],
    [7, 7 - dir]
  ];

  pointsnearteam.forEach(point => {
    const [x, y] = point;
    let cell = data.field[x][y];
    // Only check if the cell is 'ground' or 'grass'
    if (cell == 'ground' || cell == 'grass') {
      let similarCells = 0;
      // Array of directions to check (up, down, left, right)
      let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      // Check all neighboring cells
      for (let i = 0; i < directions.length; i++) {
        let nx = directions[i][0];
        let ny = directions[i][1];
        // Check bounds
        if (x + nx >= 0 && x + nx < 9 && y + ny >= 0 && y + ny < 9) {
          let neighborCell = data.field[x + nx][y + ny];
          if (neighborCell == cell) similarCells++;
        }
      }
      // If there is not another similar cell around this point, change its type
      if (similarCells == 0) {
        data.field[x][y] = (cell == 'ground') ? 'grass' : 'ground';
      }
    }
  });


  if (!ai) {
    bluearr[0].tp = 'aerostat'
    orangearr[0].tp = 'aerostat'
    orangearr[1].tp = 'headcrab'
    bluearr[1].tp = 'headcrab'

    points = []
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        if (data.field[x][y].slice(0, -1) != 'team'
          && data.field[x + 1] && data.field[x + 1][y].slice(0, -1) != 'team'
          && data.field[x - 1] && data.field[x - 1][y].slice(0, -1) != 'team'
          && data.field[x][y + 1] && data.field[x][y + 1].slice(0, -1) != 'team'
          && data.field[x][y - 1] && data.field[x][y - 1].slice(0, -1) != 'team'
        )
          points.push({ x, y });
      }
    }
    points = _.sampleSize(points, _.random(5) + 2);
    let wc = 0;
    points.forEach((e, i) => {
      data.unit.push(makeUnit('mashroom', e.x, e.y, 3));
      // if (i == 0)
      //   data.unit.push(makeUnit('mashroom', e.x, e.y, 3));
      // else
      //   data.unit.push(makeUnit(_.sample(neutral), e.x, e.y, 3));
    });
  }
  else {
    barraks = _.shuffle(barraks);
    bluearr = _.sampleSize(bluearr, 9);
    orangearr = _.sampleSize(orangearr, 9);
    let e = 'firebat'
    bluearr[0].tp = 'hoplite'
    bluearr[1].tp = 'hoplite'
    bluearr[2].tp = 'hoplite'
    bluearr[3].tp = barraks[3]
    bluearr[4].tp = barraks[4]
    bluearr[5].tp = barraks[5]
    orangearr[1].tp = 'firebat'
    orangearr[2].tp = 'firebat'
    orangearr[3].tp = 'firebat'
    orangearr[0].tp = 'firebat'
    orangearr[4].tp = 'firebat'
    orangearr[5].tp = 'firebat'
  }

  bluearr.forEach(e => {
    data.unit.push(makeUnit(e.tp || rndUnit(), e.x, e.y, 1));
  });
  orangearr.forEach(e => {
    data.unit.push(makeUnit(e.tp || rndUnit(), e.x, e.y, 2));
  });

  return data
}
