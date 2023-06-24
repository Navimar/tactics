let mobile = false;

let local = {
  time: 0,
  seconds: 0,
  lastclick: 0,
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
  rise: false,
  cadr: 0,

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
    isActive: false,
    isReady: true,
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
    isActive: false,
    isReady: true,
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
    isActive: false,
    isReady: true,
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

let tip = (text, x, y, color, dur, size) => {
  if (!size) {
    size = 100
  }
  if (!dur)
    dur = 5;
  local.tip = { text, x, y, color, size, dur }
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
  onStep(0);
  step(new Date().getTime());
  login();
  renderhtml();
};

var resizeId;
window.addEventListener('resize', function (event) {
  clearTimeout(resizeId);
  resizeId = setTimeout(doneResizing, 500);
}, true);

function doneResizing() {
  render();
}

function step(lastTime) {
  let time = new Date().getTime();
  let timeDiff = time - lastTime;
  lastTime = time;
  if (!document.hidden)
    onStep(timeDiff);
  // setTimeout(function () {
  requestAnimationFrame(function () {
    step(lastTime);
  });
  // }, 1000 / 100);
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
    if (data.turn && data.bonus != 'choose' && !data.chooseteam && local.seconds >= local.lastclick + 45) {
      local.lastclick = local.seconds
      tip('Не забывайте передать ход сопернику', 3, 3, '#F00', 5, 200);
      render();
    };
    // if (!data.bonus && local.fisher[0] != '' && local.fisher[0] <= 0) endturn();
    // renderpanel();
  }
  if (tapDown && local.time - tapTime > interval) {
    onMouseDownRight();
    tapDown = false;
  }

  if (local.cadr > 1000) {
    local.rise = false
    local.cadr = 1000
  }
  if (local.cadr < -1000) {
    local.rise = true
    local.cadr = -1000

  }
  if (local.rise)
    local.cadr += diff
  else
    local.cadr -= diff
  renderanimated(diff);
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
  // updateAudio.play();
  // console.log(val);
  data = val;
  local.tip = false;
  local.unit = false;
  local.sandclock = false;
  local.fisher[0] = data.fisher[0];
  local.fisher[1] = data.fisher[1];
  // console.log('dataturn',data.turn)
  if (local.turn == false && data.turn == true) {
    tip('ВАШ ХОД!!!', 3, 4, "#1ebe29", 10, 250);
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
  if (local.unit && local.unit.akt)
    return local.unit.akt.find(a => (x == a.x && y == a.y));
}

let clickOnAkt = () => {
  if (local.unit && local.unit.akt && data.turn && local.unit.canMove) {
    local.order = getAkt(mouseCell.x, mouseCell.y);
    if (local.order) {
      send();
      local.sandclock = { x: local.order.x, y: local.order.y }
      leftclickcn = 0;
      return true
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
    } else {
      tip('Нажмите на юнита, чтобы построить такого же', mouseCell.x, mouseCell.y, '#005500')
    }
  }
  else if (!data.turn) {
    tip('Сейчас ход соперника', mouseCell.x, mouseCell.y, '#005500')
  }
  else if (local.unit && local.unit.color == 3 && !local.unit.isReady) {
    tip('Я гриб!', mouseCell.x, mouseCell.y, '#333')
  }
  else if (local.unit && data.chooseteam) {
    tip('Вам нужно нажать на любой белый квадратик чтобы ходить юнитом!', mouseCell.x, mouseCell.y, '#333')
  }
  else if (local.unit && local.unit.color != 1) {
    tip('Это юнит соперника! Ходите юнитами с белой обводкой!!!', mouseCell.x, mouseCell.y, '#333')
  }
  else if (local.unit) {
    tip('Вам нужно нажать на любой белый квадратик чтобы ходить юнитом!', mouseCell.x, mouseCell.y, '#333')
  }
  console.log('on alt false');
  return false
}

let onMouseDown = () => {
  local.lastclick = local.seconds;
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
  else if (data.bonus == 'choose') {
    if (((mouseCell.y > -3 && mouseCell.y < 0) || (mouseCell.x > -3 && mouseCell.x < 0))) {
      let b
      if (mouseCell.x < 0)
        b = (mouseCell.x + 2) * 9 + mouseCell.y;
      if (mouseCell.y < 0)
        b = (mouseCell.y + 2) * 9 + mouseCell.x;
      sendbonus(b);
    } else {
      tip('Нажмите на одну из красных кнопок с числом! Это определит, кто будет ходить первым.', mouseCell.x, mouseCell.y, '#222')
    }
  }
  else if (data.bonus == 'wait') {
    tip('Соперник еще выбирает бонус. Подождите', mouseCell.x, mouseCell.y, '#222')
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
      if (local.frame > 0)
        showframe(data.keyframe);
    }
    else if (data.bonus == 'ready' && data.win != 'win' && data.win != 'defeat') {
      let wise = false
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
      else if ((local.unit.x != mouseCell.x || mouseCell.y != local.unit.y)) {
        let gu = getUnit(mouseCell.x, mouseCell.y);
        let gakt = getAkt(mouseCell.x, mouseCell.y);
        if (local.unit && gakt) {
          leftclickcn++
          if (leftclickcn == 2) {
            let txt = 'Если вместо выделения вы хотите отдать приказ — нажмите ПРАВОЙ кнопкной мыши!!!'
            if (mobile)
              txt = 'Если вместо выделения вы хотите отдать приказ — сделайте ДОЛГОЕ нажатие!!!'
            tip(txt, mouseCell.x, mouseCell.y, '#550000')
            leftclickcn = 0;
            wise = true;
          }
        }

        if (gu) {
          if (gu.color == 1 || !clickOnAkt()) {
            local.unit = gu
            local.build = false;
          }
        }
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
          else if (local.unit)
            clickOnAkt()
          else
            if (data.chooseteam)
              tip('Выделите синиго или рыжего юнита. И ходите им!', mouseCell.x, mouseCell.y, '#333')
            else
              tip('Выделите юнита с белой обводкой и ходите им!', 3, 3, '#000', 5, 120);

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
      // local.focus = false;
      // local.akt = [];
      if (local.unit && local.unit.color == 3 && !local.unit.canMove) {
        // local.unit = false;
        tip('Это нейтральный юнит. Выбери другого', mouseCell.x, mouseCell.y, '#050')
      }
      if (local.unit && !local.unit.isReady && !wise) {
        tip('Этот юнит устал и никуда не пойдет. Ходите юнитами с белой обводкой', mouseCell.x, mouseCell.y, '#050')
      }

    }
  }
  render();
}

let onMouseDownRight = () => {
  local.lastclick = local.seconds;
  if (!data.history) {
    local.tip = false;
    nextunit = 0;
    if (blocked)
      tip('Секундочку...', mouseCell.x, mouseCell.y, '#005500')
    clickOnAkt();

    // console.log(data.turn)
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