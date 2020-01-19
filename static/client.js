let local = {
  akt: [],
  focus: false,
  fisher: [999, 120],
};
let data = {
  fisher: ['???', '!!!'],
  leftturns: 'нет подключения к серверу',
  trail: [],
  field:
    [['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],
    ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water',],],
  unit: [{
    img: 'barbarian',
    x: 5,
    y: 3,
    m: true,
    life: 3,
    color: 2,
    akt: [
      {
        x: 4,
        y: 3,
        img: 'move',
      },
      {
        x: 3,
        y: 3,
        img: 'move',
      }
    ]
  },
  {
    img: 'zombie',
    life: 2,
    x: 5,
    y: 4,
    m: false,
    color: 1,
    akt: [
      {
        x: 4,
        y: 5,
        img: 'convertor',
      }
    ]
  },
  {
    img: 'aerostat',
    life: 1,
    x: 2,
    y: 3,
    m: false,
    color: 2,
    akt: [
      {
        x: 3,
        y: 3,
        img: 'aerostat.drop',
      }
    ]
  }]
};
let fieldmask = (() => {
  let arr=[]
  for (let y = 0; y < 9; y++) {
    arr[y] = [];
    for (let x = 0; x < 9; x++) {
      arr[y][x] = [Math.random(), Math.random()];
    }
  }
  return arr
})();

let leftclickcn = 0;
let nextunit = 0;

window.onload = function () {
  render();
  inputMouse();
  inputServer();
  step(new Date().getTime());
  socket.emit("login", { id: findGetParameter("id"), pass: findGetParameter("key") });
};


function step(lastTime) {
  let time = new Date().getTime();
  let timeDiff = time - lastTime;
  lastTime = time;

  onStep(timeDiff);
  setTimeout(function () { step(lastTime) }, 1000);
  // requestAnimFrame(function () {
  // step(lastTime);
  // });
}


let render = () => {
  resize();
  let renderfield = () => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        drawField(data.field[x][y], x, y, fieldmask[x][y]);
        // drawImg("grass", x, y);
      }
    }
    // drawBoard();

  }
  let renderunit = () => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        let u = data.unit.filter(u => u.x == x && u.y == y)[0];
        if (u) {
          drawProp(u.img, u.x, u.y, u.m, u.color, u.isReady, u.isActive);
          drawLife(u.life, u.x, u.y);
        }
      }
    }
    // data.unit.forEach(u => {
    //     drawProp(u.img, u.x, u.y, u.m, u.color);
    //     drawLife(u.life, u.x, u.y);
    // });
    if (local.unit && local.unit.akt) {
      local.unit.akt.forEach(a => {
        drawAkt(a.img, a.x, a.y);
      });
      drawImg('focus', local.unit.x, local.unit.y)
    }
  }
  let rendertrail = () => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        let u = data.trail.filter(u => u.x == x && u.y == y)[0];
        if (u) {
          drawTrail(u.img, u.x, u.y);
        }
      }
    }
  }

  if (data.turn == 1) {
    drawBackground('edgeTurn');
  } else {
    drawBackground('edgeWait');
  }
  renderfield()
  renderunit();
  renderpanel();
  rendertrail();

  if (local.focus) {
    drawImg('focus', local.focus.x, local.focus.y)
  }

}
let renderpanel = () => {
  // console.log(data.leftturns)
  if (data.turn) {
    drawSize('turn', -2, 0, 2, 2)
  } else {
    drawSize('turnEnemy', -2, 0, 2, 2)
  }
  if (data.win=='win') {
    drawSize('win', -2, 2, 2, 2)
  }
  if (data.win == 'defeat') {
    drawSize('defeat', -2, 2, 2, 2)
  }
  drawTxt(data.leftturns + '', -2, 0, '#222')
  renderFisher();
}
let renderFisher = () => {
  drawTxt(local.fisher[0] + '', -2, 0.5, '#090')
  drawTxt(local.fisher[1] + '', -1, 0.5, '#f00')
}

let onStep = (diff) => {
  console.log('step');
  if (data.turn)
    local.fisher[0]--;
  renderpanel();
}

let onLogin = (val) => {
  if (val !== 'success') {
    alert(val);
  } else {
    console.log('successful login')
  }
  render();
}
let onUpdate = (val) => {
  // console.log(val);
  data = val;
  local.unit = false;

  if (local.fisher[0] > data.fisher[0]) {
    local.fisher[0] = data.fisher[0];
  }
  local.fisher[1] = data.fisher[1];

  data.unit.forEach((u) => {
    if (u.isActive && u.akt.length > 0) {
      local.unit = u
    }
  });
  // let unit = getUnit(mouseCell.x, mouseCell.y);
  // if (unit && unit.color == 1 && unit.isReady) local.unit = unit;
  render();
  if (allakts() == 0) {
    endturn();
  }
}


let getUnit = (x, y) => {
  return data.unit.find(u => (x == u.x && y == u.y));
}
let getAkt = (x, y) => {
  return local.unit.akt.find(a => (x == a.x && y == a.y));

}

let onMouseDown = () => {
  if (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y <= 2) {
    endturn();
  } else {
    if (local.unit.x != mouseCell.x || mouseCell.y != local.unit.y) {
      local.unit = getUnit(mouseCell.x, mouseCell.y);
      if (!local.unit) {
        let arr = [];
        data.unit.forEach((u) => {
          if (u.color == 1 && u.isReady) {
            arr.push(u);
          }
        });
        if (arr[nextunit] && local.unit != arr[nextunit]) {
          local.unit = arr[nextunit];
          nextunit++;
        } else {
          nextunit = 0;
          local.unit = arr[nextunit];
          nextunit++;
        }
      }
    } else {
      local.unit = false;
    }
  }
  // local.focus = false;
  // local.akt = [];

  render();
  if (local.unit && !local.unit.isReady) {
    drawTxt('Этот юнит устал и никуда не пойдет. Ходите юнитами с белой обводкой', mouseCell.x, mouseCell.y, '#050')
    //     local.akt = local.unit.akt;
    //     local.focus = { x: unit.x, y: unit.y };
  }
  leftclickcn++
  if (leftclickcn == 5) {
    drawTxt('Приказывайте юнитам ПРАВОЙ кнопкной мыши!!!', mouseCell.x, mouseCell.y, '#550000')
    leftclickcn = 2;
  }
}

let onMouseDownRight = () => {
  nextunit = 0;
  if (local.unit && local.unit.akt && data.turn && local.unit.color == 1) {
    local.order = getAkt(mouseCell.x, mouseCell.y);
    if (local.order) {
      send();
      local.sandclock = { x: local.order.x, y: local.order.y }
      leftclickcn -= 10;
    }
  }
  // console.log(data.turn)
  render();
  if (local.unit && local.unit.color == 2) {
    drawTxt('Ходите юнитами с белой обводкой!!!', mouseCell.x, mouseCell.y, '#333')
  }
  if (!data.turn) {
    drawTxt('Сейчас ход соперника', mouseCell.x, mouseCell.y, '#005500')
  }
}

let allakts = () => {
  let arr = []
  data.unit.forEach(u => {
    if (u.color == 1)
      arr = arr.concat(u.akt);
  });
  return arr.length;
}


let send = () => {
  socket.emit("order", { unit: local.unit, akt: local.order });
}
let endturn = () => {
  local.fisher[0] += 120;
  socket.emit("endturn");
}