let mobile = false;

let local = {
  time: 0,
  seconds: 0,
  akt: [],
  focus: false,
  fisher: [999, 999],
  sandclock: { x: 0, y: 0 },
  tip: { text: 'Подключение к серверу...', x: 3, y: 3, color: '#F00', font: 300, dur: 30 },
  turn: 1,
  gameid: findGetParameter("game"),
  frame: 0,
  unitencn: 9,
  unitcn: 9,
  cost: 5,

};
let data = {
  fisher: ['???', '!!!'],
  leftturns: 'нет подключения к серверу',
  trail: [],
  spoil: [],
  gold: [11, 11],
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
    status: [],
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
    status: [],
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
    status: [],
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

let tip = (text, x, y, color, dur, font) => {
  if (!font) {
    font = 100
  }
  if (!dur)
    dur = 5;
  local.tip = { text, x, y, color, font, dur }
}

let leftclickcn = 0;
let nextunit = 0;
let orientation = 'h'
let fisherStart = false
let connected = false
window.onload = function () {
  render();
  inputMouse();
  inputServer();
  step(new Date().getTime());
  login();
  renderhtml();
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

let renderhtml = (login) => {


  //<span>Введите ваш ID</span> <br>
  // document.getElementById('menu').innerHTML =`
  // <input placeholder="Введите ваш ID" contenteditable="true" id='userid'></input><button>Войти</button> или <>добавьте бота телеграм!<br>
  // <button>Получить ID</button>
  // `
  let html = `
   <span>Чтобы зарегестрироваться и играть с другими игроками добавьте <a href="http://t.me/unitcraftbot">телеграм бота</a><br>
   А также заходите в <a href="http://t.me/unitcraft">наш чат в телеграме</a></span>
  `
  if (login == 'success')
    html = `Ваш ID ` + findGetParameter("id");
}

let render = () => {
  resize();
  let renderhistory = () => {

  }
  let renderfield = (x, y) => {
    // for (let y = 8; y >= 0; y--) {
    //   for (let x = 8; x >= 0; x--) {
    //     drawField('back', x, y, fieldmask[x][y]);
    //     // drawImgNormal('cliff', x, y, fieldmask[x][y]);

    //   }
    // }
    // for (let y = 8; y >= 0; y--) {
    //   for (let x = 8; x >= 0; x--) {
    let v = 0
    // if (data.field[x][y] == 'ground')
    //   v = 0.4
    //     if (data.field[x][y] == 'team1' || data.field[x][y] == 'team2')
    //   v = 0.2
    // if (data.field[x][y] == 'ground') data.field[x][y] = 'water'

    drawImgNormal(data.field[x][y], x, y + v, fieldmask[x][y]);

    if (data.field[x][y - 1] && data.field[x][y - 1] != data.field[x][y])
      drawImgNormal('ns' + data.field[x][y - 1] + data.field[x][y], x, y - 0.5, fieldmask[x][y]);
    // if (data.field[x][y + 1])
    //   drawImgNormal('sn' + data.field[x][y] + data.field[x][y + 1], x, y, fieldmask[x][y]);
    if (data.field[x - 1] && data.field[x - 1][y] != data.field[x][y])
      drawImgNormal('we' + data.field[x - 1][y] + data.field[x][y], x - 0.5, y, fieldmask[x][y]);
    if (!data.chooseteam && data.bonus == 'ready') {
    } else {
      if (data.field[x][y] == 'team1')
        drawImgNormal('bluestart', x, y, fieldmask[x][y]);
      if (data.field[x][y] == 'team2')
        drawImgNormal('orangestart', x, y, fieldmask[x][y]);
    }
    if (data.turn)
      if (data.field[x][y] == 'team1' && data.gold[0] >= local.cost)
        drawImg('canBuild', x, y,);
    // if (data.field[x+1][y])
    //   drawImgNormal('ew' + data.field[x][y] + data.field[x+1][y], x, y, fieldmask[x][y]);


    // if (data.field[x][y] == 'water' && data.field[x][y - 1] == 'grass')
    //   drawImgNormal('water.grass.cliff', x, y, fieldmask[x][y]);
    // if (data.field[x][y] == 'water' && (data.field[x][y - 1] == 'team1' || data.field[x][y - 1] == 'team2'))
    //   drawImgNormal('water.team.cliff', x, y, fieldmask[x][y]);
    // if (data.field[x][y] == 'ground' && (data.field[x][y - 1] == 'team1' || data.field[x][y - 1] == 'team2'))
    //   drawImgNormal('team.cliff', x, y, fieldmask[x][y]);


    // drawField(data.field[x][y], x, y + v, fieldmask[x][y]);
    // drawImg("grass", x, y);
    // for (let y = 0; y < 9; y++) {
    //   for (let x = 0; x < 9; x++) {
    //     if (data.field[x][y] == 'team1' || data.field[x][y] == 'team2') drawSize('teamroof1',x-0.5, y-0.5, 2, 2)
    //   }
    // }
    // if (data.field[x][y] == 'grass') drawImgNormal(data.field[x][y], x, y, fieldmask[x][y]);
    // if (data.field[x][y] == 'ground' && data.field[x][y - 1] == 'grass' && ((data.field[x + 1] && (data.field[x + 1][y - 1] == 'team1' || data.field[x + 1][y - 1] == 'team2')) ||( data.field[x - 1] && (data.field[x - 1][y - 1] == 'team1' || data.field[x - 1][y - 1] == 'team2'))))
    //   drawImgNormal('cliff', x, y, fieldmask[x][y]);
    // drawBoard();

  }
  let renderunit = (x, y) => {
    let u = data.unit.filter(u => u.x == x && u.y == y)[0];
    if (u) {
      // let v = -0.15
      if (data.field[x][y] == 'ground')
        drawProp(u.img, u.x, u.y - 0.1, u.m, u.color, u.isReady, u.isActive);
      else
        if (data.field[x][y] == 'water') {
          drawProp(u.img, u.x, u.y - 0.1, u.m, u.color, u.isReady, u.isActive);
          drawImgNormal('drawn', x, y, fieldmask[x][y]);
        }
        else
          drawProp(u.img, u.x, u.y - 0.1, u.m, u.color, u.isReady, u.isActive, 18);
      // drawLife(u.life, u.x, u.y);

      if (u.sticker)
        drawSize(u.sticker, x + 0.2, y + 0.4, 0.6, 0.6)
      u.status.forEach(stt => drawStatus(stt, u.x, u.y, u.m, u.color, u.isReady, u.isActive));
    }
  }
  let renderspoil = (x, y) => {
    let u = data.spoil.filter(u => u.x == x && u.y == y);
    u.forEach((s) => {
      drawSpoil(s.name, s.x, s.y);
    });
  }
  let renderakt = () => {
    if (local.unit && local.unit.akt) {
      local.unit.akt.forEach(a => {
        drawAkt(a.img, a.x, a.y);
      });
      drawImg('focus', local.unit.x, local.unit.y)
    } else if (local.build) {
      data.unit.forEach(u => drawAkt('build', u.x, u.y));
      drawImg('focus', local.build.x, local.build.y)
    }

  }
  let rendertrail = () => {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 9; x++) {
        let u = data.trail.filter(u => u.x == x && u.y == y);
        u.forEach((t) => {
          drawTrail(t.img, t.x, t.y);
        });
      }
    }
  }
  let rendertip = () => {
    if (local.tip && local.tip.dur > 0)
      drawTxt(local.tip.text, local.tip.x, local.tip.y, local.tip.color, local.tip.font);
  }
  if (data.history)
    drawBackground('history');
  else {
    if (data.turn == 1) {
      drawBackground('edgeTurn');
    } else {
      drawBackground('edgeWait');
    }
  }
  renderpanel();
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      renderfield(x, y)
    }
    for (let x = 0; x < 9; x++) {
      renderspoil(x, y);
    }
    for (let x = 0; x < 9; x++) {
      renderunit(x, y);
    }
    // for (let x = 0; x < 9; x++) {
    //   rendersticker(x,y);
    // }
  }
  if (local.sandclock) {
    drawImg('sandclock', local.sandclock.x, local.sandclock.y)
  }

  rendertrail();
  renderakt();
  if (!socket.connected)
    tip('Разорвано соединение с сервером...', 3, 3, '#F00', 5, 200);

  rendertip();
  if (local.focus) {
    drawImg('focus', local.focus.x, local.focus.y)
  }

}
let renderpanel = () => {
  let c = [
    [-2, 0],
    [-2, 2],
    [-2, 8],
    [-2, 6],
    [-2, 4]
  ]
  if (orientation == 'h') {
    c.forEach(e => e.reverse());
  }
  drawSize('help', c[4][0], c[4][1], 2, 2)

  if (data.finished) {
    // drawSize('frame', c[3][0], c[3][1], 2, 2)
  } else {
    // drawSize('help', c[3][0], c[3][1], 2, 2)
    if (orientation == 'w') {
      drawSize('surrender', c[2][0], c[2][1], 2, 1)
    } else
      drawSize('surrenderh', c[2][0], c[2][1], 1, 2)

  }

  if (local.frame > 0)
    drawSize('frame', c[3][0], c[3][1], 2, 2)

  if (data.bonus == 'choose') {
    drawSize('choose', c[0][0], c[0][1], 2, 2)
  } else if (data.bonus == 'wait') {
    drawSize('wait', c[0][0], c[0][1], 2, 2)
  }
  else if (data.turn) {
    drawSize('turn', c[0][0], c[0][1], 2, 2)
  } else {
    drawSize('turnEnemy', c[0][0], c[0][1], 2, 2)
  }
  if (data.win == 'win') {
    drawSize('win', c[0][0], c[0][1], 2, 2)
  }
  if (data.win == 'defeat') {
    drawSize('defeat', c[0][0], c[0][1], 2, 2)
  }

  drawTxt(local.fisher[0] + '', c[0][0] + 0.15, c[0][1] + 0.4 + 0.15, '#090')
  drawTxt(local.fisher[1] + '', c[0][0] + 1 + 0.15, c[0][1] + 0.4 + 0.15, '#f00')
  let team1 = 0
  let team2 = 0

  data.unit.forEach((u) => {
    if (u.color == 1)
      team1 += u.life
    if (u.color == 2)
      team2 += u.life
  });
  if (team1 - team2 > 0) {
    team1 -= team2;
    team2 -= team2
  } else {
    team2 -= team1;
    team1 -= team1
  }

  let arr = [];
  data.unit.forEach((u) => {
    if (u.color == 1 && u.isReady && !u.isActive) {
      arr.push(u);
    }
  });
  drawSize('next', c[1][0], c[1][1], 2, 2)

  drawTxt(arr.length + '', c[1][0] + 0.15, c[1][1] + 1.6, '#222')
  drawTxt(data.leftturns + '', c[0][0] + 1.5, c[0][1] + 0.1, '#222');

  let goldtext = data.gold[0] + '';
  drawTxt(goldtext, c[1][0] + 0.15, c[1][1] + 0.3, '#090')
  drawTxt(data.gold[1] + '', c[1][0] + 0.15, c[1][1] + 0.6 + 0.3, '#f00')
  drawTxt(local.unitcn + '', c[1][0] + 1.6, c[1][1] + 0.3, '#222')
  drawTxt(local.unitencn + '', c[1][0] + 1.6, c[1][1] + 0.6 + 0.3, '#222')


  // drawTxt(team1 + '', c[1][0] + 0.15, c[1][1] + 0.5 + 0.15, '#090')
  // drawTxt(team2 + '', c[1][0] + 1 + 0.15, c[1][1] + 0.5 + 0.15, '#f00')

  if (data.bonus == 'choose') {
    let i = 0;
    for (let fx = 9; fx < 11; fx++) {
      for (let fy = 0; fy < 9; fy++) {
        if (orientation == 'h') {
          drawImgNormal('bonus', fy, fx)
          drawTxt(("0" + i).slice(-2), fy + 0.20, fx + 0.20, '#000', 170)
        } else {
          drawImgNormal('bonus', fx, fy)
          drawTxt(("0" + i).slice(-2), fx + 0.24, fy + 0.30, '#000', 170)
        }
        i++
      }
    }
  }

}

let onStep = (diff) => {
  // console.log('step');
  local.time += diff;
  // console.log(local.tip.dur);
  if (Math.floor(local.time / 1000) > local.seconds) {
    local.seconds = Math.floor(local.time / 1000)
    local.tip.dur--;
    if (data.turn) {
      local.fisher[0]--;
    } else {
      local.fisher[1]--;
    }
    if (!data.bonus && local.fisher[0] != '' && local.fisher[0] == 30) {
      tip('Вы не успеваете закончить ход. Ход будет передан сопернику через 30 секунд!', 3, 3, '#F00', 5, 200);
      render();
    };
    // if (!data.bonus && local.fisher[0] != '' && local.fisher[0] <= 0) endturn();
    // renderpanel();
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
    renderhtml(val);
  }
  render();
}
let onUpdate = (val) => {
  blocked = false
  updateAudio.play();
  // console.log(val);
  data = val;
  local.tip = false;
  local.unit = false;
  local.sandclock = false;
  local.fisher[0] = data.fisher[0];
  local.fisher[1] = data.fisher[1];
  // console.log('dataturn',data.turn)
  if (local.turn == false && data.turn == true) {
    tip('ВАШ ХОД!!!', 3, 3, "#1ebe29", 10, 400);
    local.turn = data.turn;
  }
  local.unitcn = 0;
  local.unitencn = 0;

  data.unit.forEach((u) => {
    if (u.isActive && u.akt.length > 0) {
      local.unit = u
    }
    if (u.color == 1)
      local.unitcn++
    if (u.color == 2)
      local.unitencn++
  });
  // console.log(data.history,local.frame, data.frame,data.keyframe);

  if (local.frame != data.frame) {
    local.frame = data.frame
  }
  render();
  if (!data.history && allakts() == 0 && data.gold[0] < local.unitcn) {
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
  if (!socket.connected) {
    tip('Подключение к серверу...', 3, 3, '#FF0', 5, 200);
    login();
  }
  else if (data.history) {
    if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x >= 6 && mouseCell.x <= 7) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y >= 6 && mouseCell.y <= 7))) {
      // if (data.finished) {
      // rematch();
      if (local.frame > 0)
        showframe(data.keyframe);
      // }
    } else {
      showframe(data.frame + 1);
    }
  }
  else {
    local.tip = false;
    if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x >= 8) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y >= 8))) {
      if (!data.finished) {
        surrender();
      }
    }
    else if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x >= 4 && mouseCell.x <= 5) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y >= 4 && mouseCell.y <= 5))) {
      if (local.unit)
        tip(local.unit.description, 3, 3, '#000', 5, 120);
      else if (local.build)
        tip('Контрольная точка. Приносит 1 золото в конце хода. Позволяет строить юнитов', 3, 3, '#000', 5, 120);
      else
        tip('Выдели юнита и нажми на эту кнопку, чтобы узнать его способность', 3, 3, '#000', 5, 120);
    }
    else if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x >= 6 && mouseCell.x <= 7) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y >= 6 && mouseCell.y <= 7))) {
      // if (data.finished) {
      // rematch();
      if (local.frame > 0)
        showframe(data.keyframe);
      // }
    }
    else if (data.bonus == 'ready' && data.win != 'win' && data.win != 'defeat') {
      if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x <= 1) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y <= 1)) && data.turn) {
        endturn();
      }
      else if (((mouseCell.y >= -2 && mouseCell.y < 0 && mouseCell.x >= 2 && mouseCell.x < 4) || (mouseCell.x >= -2 && mouseCell.x < 0 && mouseCell.y >= 2 && mouseCell.y < 4))) {
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
          local.unit = false;
          // nextunit++;
        }
      }
      else if (local.unit.x != mouseCell.x || mouseCell.y != local.unit.y) {
        let gu = getUnit(mouseCell.x, mouseCell.y);
        if (gu) {
          local.unit = gu
          local.build = false;
        }
        //если выделил пустоту
        else {
          if (local.build && (mouseCell.x == local.build.x && mouseCell.y == local.build.y)) {
            local.build = false;
          }
          else if (data.field[mouseCell.x][mouseCell.y] == 'team1') {
            if (data.gold[0] >= local.cost) {
              local.build = { x: mouseCell.x, y: mouseCell.y }
              local.unit = false;
            }
            else {
              tip('Нужно ' + local.cost + ' золота, чтобы построить юнита. У вас ' + data.gold[0] + " золота", mouseCell.x, mouseCell.y, '#f00')
            }
          }
          // let arr = [];
          // data.unit.forEach((u) => {
          //   if (u.color == 1 && u.isReady) {
          //     arr.push(u);
          //   }
          // });
          // if (arr[nextunit] && local.unit != arr[nextunit]) {
          //   local.unit = arr[nextunit];
          //   nextunit++;
          // } else {
          //   nextunit = 0;
          //   local.unit = arr[nextunit];
          //   nextunit++;
          // }
        }
      } else {
        //нажал на себя
        local.unit = false;
      }
      leftclickcn++
      // local.focus = false;
      // local.akt = [];
      if (local.unit && local.unit.color == 3 && !local.unit.canMove) {
        // local.unit = false;
        tip('Это нейтральный юнит. Выбери другого', mouseCell.x, mouseCell.y, '#050')
      }
      if (local.unit && !local.unit.isReady) {
        tip('Этот юнит устал и никуда не пойдет. Ходите юнитами с белой обводкой', mouseCell.x, mouseCell.y, '#050')
      }
      if (leftclickcn == 5) {
        let txt = 'Приказывайте юнитам ПРАВОЙ кнопкной мыши!!!'
        if (mobile)
          txt = 'Приказывайте юнитам ДОЛГИМ нажатием!!!'
        tip(txt, mouseCell.x, mouseCell.y, '#550000')

        leftclickcn = 2;
      }
    }
    else if (data.bonus == 'choose') {
      if (((mouseCell.y > 8 && mouseCell.y < 11) || (mouseCell.x > 8 && mouseCell.x < 11))) {
        let b
        if (mouseCell.x > 8)
          b = (mouseCell.x - 9) * 9 + mouseCell.y;
        if (mouseCell.y > 8)
          b = (mouseCell.y - 9) * 9 + mouseCell.x;
        sendbonus(b);
      } else {
        tip('Нажмите на одну из красных кнопок с числом! Это определит, кто будет ходить первым.', mouseCell.x, mouseCell.y, '#222')
      }
    }
    else if (data.bonus == 'wait') {
      tip('Соперник еще выбирает бонус. Подождите', mouseCell.x, mouseCell.y, '#222')
    }
  }
  render();
}

let onMouseDownRight = () => {
  if (!data.history) {
    local.tip = false;
    nextunit = 0;
    if (blocked)
      tip('Секундочку...', mouseCell.x, mouseCell.y, '#005500')
    if (local.unit && local.unit.akt && data.turn && local.unit.canMove) {
      local.order = getAkt(mouseCell.x, mouseCell.y);
      if (local.order) {
        send();
        local.sandclock = { x: local.order.x, y: local.order.y }
        leftclickcn -= 5;
      }
    }
    if (local.build && data.turn) {
      let u = getUnit(mouseCell.x, mouseCell.y);
      if (u) {
        if (!blocked) {
          socket.emit("order", { unit: u.tp, akt: { img: 'build', x: local.build.x, y: local.build.y }, gameid: local.gameid });
          local.build = false
        }
        blocked = true;
        local.sandclock = { x: local.build.x, y: local.build.y }
        leftclickcn -= 5;
      } else {
        tip('Нажмите на юнита, какого вы хотите построить', mouseCell.x, mouseCell.y, '#005500')
      }
    }
    // console.log(data.turn)
    if (!data.turn) {
      tip('Сейчас ход соперника', mouseCell.x, mouseCell.y, '#005500')
    }
    else if (local.unit && local.unit.color == 3 && !local.unit.isReady) {
      tip('Я гриб!', mouseCell.x, mouseCell.y, '#333')
    }
    else if (local.unit && local.unit.color != 1) {
      if (data.chooseteam) {
        tip('Это нейтрал. Выберите синию или рыжую команду', mouseCell.x, mouseCell.y, '#333')
      } else
        tip('Ходите юнитами с белой обводкой!!!', mouseCell.x, mouseCell.y, '#333')
    }
    render();
  }
}

let allakts = () => {
  let arr = []
  data.unit.forEach(u => {
    if (u.canMove)
      arr = arr.concat(u.akt);
  });
  return arr.length;
}


let send = () => {
  if (!blocked)
    socket.emit("order", { unit: local.unit, akt: local.order, gameid: local.gameid });
  blocked = true;
}
let sendbonus = (bonus) => {
  if (!blocked)
    socket.emit("bonus", { bonus, gameid: local.gameid });
  blocked = true;
}
let showframe = (frame) => {
  local.frame = frame;
  socket.emit("frame", { gameid: local.gameid, frame });
}
let surrender = () => {
  if (!blocked)
    socket.emit("surrender", { gameid: local.gameid });
  blocked = true;
}
let rematch = () => {
  if (!blocked)
    socket.emit("rematch", { gameid: local.gameid });
  blocked = true;
}
let endturn = () => {
  local.turn = false;
  // local.fisher[0] += 120;
  if (!blocked)
    socket.emit("endturn", { gameid: local.gameid });
  blocked = true;
}

let login = () => {
  socket.emit("login", { id: findGetParameter("id"), pass: findGetParameter("key"), gameid: local.gameid });
}