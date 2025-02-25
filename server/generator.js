const meta = require("./meta");
const en = require("./engine");
const _ = require("lodash");

const START_UNIT = "base";
// const SECOND_UNIT = "staziser";
const SECOND_UNIT = false;

exports.new = (rank, ai) => {
  rank = 9999;
  let barraks = [];
  Object.keys(meta).forEach(function (key) {
    if (meta[key].rank <= rank)
      if (meta[key].weight) if (meta[key].class == "basic") barraks.push(key);
  });

  let neutral = [];
  Object.keys(meta).forEach(function (key) {
    if (meta[key].rank <= rank)
      if (meta[key].weight) if (meta[key].class == "neutral") neutral.push(key);
  });

  let makeUnit = (tp, x, y, team) => {
    return en.makeUnit(tp, x, y, team);
  };
  let rndUnit = () => {
    let i = _.random(barraks.length - 1);
    let r = barraks[i];
    // barraks.splice(i, 1)
    if (r) return r;
    else return "warrior";
  };

  let data = {
    unit: [],
    field: [],
  };

  for (let x = 0; x < 9; x++) {
    data.field[x] = [];
    for (let y = 0; y < 9; y++) {
      data.field[x][y] = "none";
    }
  }
  let points = en.allPoints();
  points = _.sampleSize(points, 81);

  // data.field[points[0].x][points[0].y] = 'ground'
  // data.field[points[1].x][points[1].y] = 'ground'

  let defground = 1;
  let defgrass = 1;
  let defsky = 0;
  let defmountain = 0;
  let grasspower = 10000;
  let groundpower = 10000;

  let dir = 1;
  let terrain = ["ground", "ground", "grass", "grass"];
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[4 + dir][4] = terrain[0];
  data.field[4 - dir][4] = terrain[1];
  data.field[4][4 + dir] = terrain[2];
  data.field[4][4 - dir] = terrain[3];
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[1 + dir][1] = terrain[0];
  data.field[1][1 - dir] = terrain[1];
  data.field[1][1 + dir] = terrain[2];
  data.field[1 - dir][1] = terrain[3];
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[7 + dir][1] = terrain[0];
  data.field[7 - dir][1] = terrain[1];
  data.field[7][1 + dir] = terrain[2];
  data.field[7][1 - dir] = terrain[3];
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[1 + dir][7] = terrain[0];
  data.field[1 - dir][7] = terrain[1];
  data.field[1][7 + dir] = terrain[2];
  data.field[1][7 - dir] = terrain[3];
  terrain = _.sampleSize(terrain, terrain.length);

  data.field[7 + dir][7] = terrain[0];
  data.field[7 - dir][7] = terrain[1];
  data.field[7][7 + dir] = terrain[2];
  data.field[7][7 - dir] = terrain[3];

  points.forEach((p) => {
    if (data.field[p.x][p.y] == "none") {
      let ground = defground;
      let grass = defgrass;
      let mountain = defmountain;
      let sky = defsky;
      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == "ground") ground += groundpower;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == "ground") ground += groundpower;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == "ground") ground += groundpower;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == "ground") ground += groundpower;

      if (data.field[p.x + 1] && data.field[p.x + 1][p.y] == "grass") grass += grasspower;
      if (data.field[p.x][p.y + 1] && data.field[p.x][p.y + 1] == "grass") grass += grasspower;
      if (data.field[p.x][p.y - 1] && data.field[p.x][p.y - 1] == "grass") grass += grasspower;
      if (data.field[p.x - 1] && data.field[p.x - 1][p.y] == "grass") grass += grasspower;

      if (ground > grass) grass = 0;
      if (ground < grass) ground = 0;

      let r = _.random(ground + grass + sky + mountain - 1);
      if (r < ground) data.field[p.x][p.y] = "ground";
      else if (r >= ground && r < ground + grass) data.field[p.x][p.y] = "grass";
      else if (r >= ground + grass && r < ground + grass + sky) data.field[p.x][p.y] = "sky";
      else if (r >= ground + grass + sky && r < ground + grass + sky + mountain)
        data.field[p.x][p.y] = "mountain";
    }
  });
  let makeflag = (px, py, team) => {
    data.field[px][py] = "team" + team;
    return { x: px, y: py, dir: 0 };
  };

  makeflag(4, 4, 2);
  up = makeflag(1, 1, 1);
  up = makeflag(1, 7, 1);
  up = makeflag(7, 1, 2);
  up = makeflag(7, 7, 2);
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
    [7, 7 - dir],
  ];

  pointsnearteam.forEach((point) => {
    const [x, y] = point;
    let cell = data.field[x][y];
    // Only check if the cell is 'ground' or 'grass'
    if (cell == "ground" || cell == "grass") {
      let similarCells = 0;
      // Array of directions to check (up, down, left, right)
      let directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
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
        data.field[x][y] = cell == "ground" ? "grass" : "ground";
      }
    }
  });

  points = [];
  let leftPoints = [];
  let rightPoints = [];

  // Разделяем точки на левую и правую половину
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (data.field[x][y].slice(0, -1) != "team") {
        if (x < 3) {
          leftPoints.push({ x, y });
        } else if (x > 5) {
          rightPoints.push({ x, y });
        }
      }
    }
  }
  // Выбираем равное количество точек из каждой половины
  let halfPointsCount = 3; // половина от общего количества точек, которое вы хотите добавить
  points = _.sampleSize(leftPoints, halfPointsCount).concat(
    _.sampleSize(rightPoints, halfPointsCount)
  );
  // Добавляем грибы в выбранные точки
  points.forEach((point) => {
    data.unit.push(makeUnit("mushroom", point.x, point.y, 3));
  });

  console.log(ai);
  if (ai == "mission") {
    data.unit.push(makeUnit("mushroom", 3, 4, 1));
    data.unit.push(makeUnit("mushroom", 4, 4, 1));
    data.unit.push(makeUnit("mushroom", 5, 4, 1));

    data.field[4][4] = "team1";
    data.field[7][1] = "team1";
    data.field[7][7] = "team1";
    return data;
  }

  let bluearr = [];
  let orangearr = [];
  //куст в центре
  data.unit.push(makeUnit("bush", 4, 4, 3));

  if (START_UNIT) {
    bluearr.push({ x: 1, y: 1 });
    orangearr.push({ x: 7, y: 7 });
    bluearr[0].tp = START_UNIT;
    orangearr[0].tp = START_UNIT;
  }
  if (SECOND_UNIT) {
    orangearr.push({ x: 7, y: 1, tp: SECOND_UNIT });
    bluearr.push({ x: 1, y: 7, tp: SECOND_UNIT });
  }
  bluearr.forEach((e) => {
    data.unit.push(makeUnit(e.tp || rndUnit(), e.x, e.y, 1));
  });
  orangearr.forEach((e) => {
    data.unit.push(makeUnit(e.tp || rndUnit(), e.x, e.y, 2));
  });
  return data;
  // }
};
