const meta = require('./meta');

exports.new = () => {
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
  data.field[1][1] = 'team1';
  data.field[1][7] = 'team2';
  data.field[4][4] = 'team1';
  data.field[7][7] = 'team2';
  data.field[7][1] = 'team1';
  data.unit.push(...[
    makeUnit('bear', 0, 0, 1),
    makeUnit('bear', 1, 1, 1),
    makeUnit('bear', 2, 2, 1),
    makeUnit('bear', 3, 1, 1),
    makeUnit('bear', 1, 3, 1),
    makeUnit('bear', 3, 0, 1),
    makeUnit('bear', 0, 3, 1),

    makeUnit('bear', 8, 8, 2),
    makeUnit('bear', 7, 7, 2),
    makeUnit('bear', 5, 7, 2),
    makeUnit('bear', 7, 5, 2),
    makeUnit('bear', 6, 6, 2),
    makeUnit('bear', 8, 5, 2),
    makeUnit('bear', 5, 8, 2),
  ]
  );

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