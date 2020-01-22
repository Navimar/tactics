const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

let local = {
  time: 0,
  seconds: 0,
  akt: [],
  focus: false,
  fisher: [999, 120],
  sandclock: { x: 0, y: 0 }
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
  let arr = []
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
  setTimeout(function () { step(lastTime) }, 10);
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
  if (local.sandclock) {
    drawImg('sandclock', local.sandclock.x, local.sandclock.y)
  }
  renderpanel();
  rendertrail();
  if (local.focus) {
    drawImg('focus', local.focus.x, local.focus.y)
  }

}
let renderpanel = () => {
  let x = -2
  let y = 0
  let xp = 0
  let yp = 2
  console.log(window.orientation)
  if (window.orientation == 0 && mobile) {
    x = 0
    y = -2
    xp = 2
    yp = 0
  }
  if (data.turn) {
    drawSize('turn', x, y, 2, 2)
  } else {
    drawSize('turnEnemy', x, y, 2, 2)
  }
  drawTxt(data.leftturns + '', x + 0.15, y + 0.15, '#222')
  drawTxt(local.fisher[0] + '', x + 0.15, y + 0.5 + 0.15, '#090')
  drawTxt(local.fisher[1] + '', x + 1 + 0.15, y + 0.5 + 0.15, '#f00')
  x += xp
  y += yp
  if (data.win == 'win') {
    drawSize('win', x, y, 2, 2)
  }
  if (data.win == 'defeat') {
    drawSize('defeat', x, y, 2, 2)
  }
  if (data.bonus && data.turn) {
    let i = 0;
    for (let fx = 9; fx < 11; fx++) {
      for (let fy = 0; fy < 9; fy++) {
        if (window.orientation == 0 && mobile) {
          drawImgNormal('bonus', fy, fx)

          drawTxt(("0" + i).slice(-2), fy + 0.20, fx + 0.20, '#000', "3vmax monospace")

        } else {
          drawImgNormal('bonus', fx, fy)

          drawTxt(("0" + i).slice(-2), fx + 0.20, fy + 0.20, '#000', "3vmax monospace")

        }
        i++
      }
    }
  }

}

let onStep = (diff) => {
  // console.log('step');
  local.time += diff;
  if (Math.floor(local.time / 1000) > local.seconds) {
    local.seconds = Math.floor(local.time / 1000)
    if (data.turn) {
      local.fisher[0]--;
    } else {
      local.fisher[1]--;
    }
    renderpanel();
  }
  if (tapDown && local.time - tapTime > interval) {
    onMouseDownRight();
    tapDown = false;
  }
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
  updateAudio.play();
  // console.log(val);
  data = val;
  local.unit = false;
  local.sandclock = false;

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
  if (!data.bonus) {
    if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x <= 1) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y <= 1)) && data.turn) {
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
      let txt = 'Приказывайте юнитам ПРАВОЙ кнопкной мыши!!!'
      if (mobile)
        txt = 'Приказывайте юнитам ДОЛГИМ нажатием!!!'
      drawTxt(txt, mouseCell.x, mouseCell.y, '#550000')
      leftclickcn = 2;
    }
  } else {
    if (((mouseCell.y > 8 && mouseCell.y < 11) || (mouseCell.x > 8 && mouseCell.x < 11)) && data.turn) {
      let b
      if (mouseCell.x > 8)
        b = (mouseCell.x - 9) * 9 + mouseCell.y;
      if (mouseCell.y > 8)
        b = (mouseCell.y - 9) * 9 + mouseCell.x;
      sendbonus(b);
    } else {
      render();
      if (data.turn) {
        drawTxt('Нажмите на одну из красных кнопок с числом справа! Это определит, кто будет ходить первым.', mouseCell.x, mouseCell.y, '#222')
      } else {
        drawTxt('Соперник выбирает бонус', mouseCell.x, mouseCell.y, '#222')
      }
    }
  }
}

let onMouseDownRight = () => {
  nextunit = 0;
  if (local.unit && local.unit.akt && data.turn && (local.unit.color == 1 || data.chooseteam)) {
    local.order = getAkt(mouseCell.x, mouseCell.y);
    if (local.order) {
      send();
      local.sandclock = { x: local.order.x, y: local.order.y }
      leftclickcn -= 10;
    }
  }
  // console.log(data.turn)
  render();
  if (!data.turn) {
    drawTxt('Сейчас ход соперника', mouseCell.x, mouseCell.y, '#005500')
  }
  else if (local.unit && local.unit.color == 2) {
    drawTxt('Ходите юнитами с белой обводкой!!!', mouseCell.x, mouseCell.y, '#333')
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
let sendbonus = (b) => {
  socket.emit("bonus", b);
}
let endturn = () => {
  local.fisher[0] += 120;
  socket.emit("endturn");
}