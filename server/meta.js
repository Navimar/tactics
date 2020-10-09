const en = require('./engine');
const _ = require('lodash');

// exports.warrior = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 100,
//   rank: 0,
//   class: 'none',
//   life: 3,
//   img: 'warrior',
//   akt: (akt) => {
//     return akt.move().concat(akt.hand('warrior'))
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   warrior: (wd) => {
//     if (wd.target.unit.status.includes('warrior')) {
//       wd.target.unit.status.remove('warrior')
//       wd.target.unit.tp = 'warrior';
//       // wd.changeTeam(wd.target.unit);
//       // wd.target.unit.isReady = false;
//       wd.kill();
//     }
//     else
//       wd.addStatus('warrior');
//     wd.tire();
//   }
// }

exports.base = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 100,
  rank: 0,
  class: 'base',
  life: 3,
  img: 'base',
  akt: (akt) => {
    return akt.move().concat(akt.hand('capture', 'neutral'))
  },
  move: (wd) => {
    wd.walk();
  },
  capture: (wd) => {
    wd.target.unit.team = wd.me.team;
    wd.tire();
  }
}
exports.merchant = {
  name: 'Продавец', description: 'пока не придумал',
  weight: 100,
  rank: 0,
  class: 'none',
  life: 3,
  img: 'merchant',
  akt: (akt) => {
    return akt.move().concat(akt.hand('trade'))
  },
  move: (wd) => {
    wd.walk();
  },
  trade: (wd) => {
    wd.kill();
    if (wd.target.unit.team != 3) {
      wd.game.trail.push({ img: 'gold', x: wd.target.x, y: wd.target.y });
      wd.game.gold[wd.target.unit.team - 1] += 5;
    }
    wd.tire();
  }
}
exports.chiken = {
  name: 'Уменьшитель', description: 'Превращает юнита в яйцо. В конце хода юнит благополучно вылупится обратно, если конечно никто его не раздавит раньше.',
  weight: 100,
  rank: 0,
  class: 'warrior',
  life: 3,
  img: 'chiken',
  akt: (akt) => {
    return akt.move().concat(akt.hand('chiken'))
  },
  move: (wd) => {
    wd.walk();
  },
  chiken: (wd) => {
    wd.spoil('egg', wd.target.x, wd.target.y, { tp: wd.target.unit.tp, team: wd.target.unit.team }, 3)
    wd.kill(wd.target.unit);
    wd.tire();
  }
}

exports.firebat = {
  description: 'Жжот огоньком. У горящего юнита всего один ход, чтобы прыгнуть в воду, а иначе от него останется один только костер. Кто на костер встанет, тот и сам сгорит.',
  name: 'Поджигатель',
  weight: 100,
  rank: 80,
  class: 'warrior',
  life: 3,
  img: 'firebat',
  akt: (akt) => {
    let arr = akt.move()
    let far = akt.hand('firebat')
    if (far) {
      far = far.filter(e => {
        if (en.unitInPoint(akt.game, e.x, e.y).status == 'fire' || en.unitInPoint(akt.game, e.x, e.y).status == 'fire2')
          return false
        if (akt.game.field[e.x][e.y] == 'water')
          return false
        return true
      });
      arr = arr.concat(far)
    }
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  firebat: (wd) => {
    wd.addStatus('fire');
    wd.tire();
  }
}

exports.bomber = {
  description: 'Жжот огоньком. У горящего юнита всего один ход, чтобы прыгнуть в воду, а иначе от него останется один только костер. Кто на костер встанет, тот и сам сгорит.',
  name: 'Бомбер',
  weight: 100,
  rank: 80,
  class: 'warrior',
  life: 3,
  img: 'bomber',
  akt: (akt) => {
    let arr = akt.move()
     arr = arr.concat(akt.hand('bomber'))
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  bomber: (wd) => {
    wd.addStatus('bomber');
    wd.disappear(wd.me);
    // wd.tire();
  }
}

exports.teleporter = {
  description: 'Оглушает',
  name: 'Телепортер',
  weight: 100,
  rank: 80,
  class: 'warrior',
  life: 3,
  img: 'teleporter',
  akt: (akt) => {
    let arr = akt.move()
    let far = akt.hand('teleporter')
    if (far) {
      far = far.filter(e => {
        if (en.unitInPoint(akt.game, e.x, e.y).status == 'teleporter')
          return false
        return true
      });
      arr = arr.concat(far)
    }
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  teleporter: (wd) => {
    wd.addStatus('teleporter');
    wd.tire();
  }
}

exports.staziser = {
  description: 'стазис',
  name: 'Поджигатель',
  weight: 100,
  rank: 80,
  class: 'archer',
  life: 3,
  img: 'staziser',
  akt: (akt) => {
    let arr = akt.move()
    let far = akt.hand('stazis')
    if (far) {
      far = far.filter(e => {
        if (en.unitInPoint(akt.game, e.x, e.y).status == 'stazis')
          return false
        return true
      });
      arr = arr.concat(far)
    }
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  stazis: (wd) => {
    wd.addStatus('stazis');
    wd.tire();
  },
  onDeath: (wd) => {
    wd.game.unit.forEach(u => u.status.remove('stazis'));
  }
}
exports.lover = {
  description: 'любовь',
  name: 'Влюбленный',
  weight: 100,
  rank: 80,
  class: 'archer',
  life: 3,
  img: 'lover',
  akt: (akt) => {
    let arr = akt.move()
    let far = akt.hand('love')
    if (far) {
      far = far.filter(e => {
        if (en.unitInPoint(akt.game, e.x, e.y).status == 'love')
          return false
        return true
      });
      arr = arr.concat(far)
    }
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  love: (wd) => {
    let marks = new Map();
    marks.set(wd.target.x + '_' + wd.target.y, { x: wd.target.x, y: wd.target.y });
    let nw = true;
    while (nw) {
      nw = false;
      wd.game.unit.forEach((u) => {
        if (u != wd.me) {
          let npt = en.near(u.x, u.y)
          npt.forEach((n) => {
            if (marks.get(n.x + '_' + n.y)) {
              if (!marks.get(u.x + '_' + u.y)) {
                marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
                nw = true;
              }
            }
          });
        }
      });
    }
    marks.forEach((v, k, m) => {
      wd.addStatus('love', v.x, v.y);
    });
    wd.tire();
  },
}
exports.aerostat = {
  description: 'Возит юнитов. Юнит в трюме не может ничего делать, пока его не выгрузят',
  name: 'Дерижабль',
  weight: 100,
  rank: 100,
  class: 'spec',
  life: 3,
  img: 'aerostat',
  akt: (akt) => {
    let akts = []
    let points = en.allPoints();
    points = points.filter(pt => {
      if (Math.abs(pt.x - akt.me.x) + Math.abs(pt.y - akt.me.y) <= akt.me.energy)
        return true
    });
    points.forEach((pt) => {
      let u = en.unitInPoint(akt.game, pt.x, pt.y)
      if (u && u.tp != 'aerostat')
        akts.push({
          x: pt.x,
          y: pt.y,
          img: 'take',
        })
      else if (!u)
        akts.push({
          x: pt.x,
          y: pt.y,
          img: 'fly',
        })
    });
    if (akt.me.sticker && akt.me.data.drop == false) {
      akts.push({
        x: akt.me.x,
        y: akt.me.y,
        img: 'drop',
      })
    }
    if (akt.me.sticker && akt.me.data.drop == true) {
      akts.push({
        x: akt.me.x,
        y: akt.me.y,
        img: 'undrop',
      })
    }
    return akts;
  },
  onDeath: (wd) => {
    if (wd.me.sticker) {
      en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3)
      wd.me.sticker = false
    }
  },
  fly: (wd) => {
    if (wd.me.data.drop) {
      if (wd.me.sticker) {
        en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3)
        wd.me.sticker = false
      }
    }
    wd.flywalk();
    wd.me.data.drop = false;
  },
  drop: (wd) => {
    wd.me.data.drop = true;
  },
  undrop: (wd) => {
    wd.me.data.drop = false;
  },
  take: (wd) => {
    // let mark = wd.game.sticker.filter(m => m.x == wd.me.x && m.y == wd.me.y)
    if (wd.me.sticker) {
      en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3)
      wd.me.sticker = false;
    }
    wd.me.sticker = { tp: wd.target.unit.tp, team: wd.target.unit.team }
    wd.disappear(wd.target.unit);

    // wd.target.unit.small = true;
    wd.flywalk();
    wd.me.data.drop = false;
  },
}
// exports.caterbody = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 0,
//   rank: 0,
//   class: 'none',
//   life: 3,
//   img: 'caterbody',
//   akt: (akt) => {
//     return []
//   },
//   move: (wd) => {
//     wd.walk();
//   },
// }
// exports.caterhead = {
//   description: 'Возит юнитов. Юнит в трюме не может ничего делать, пока его не выгрузят',
//   name: 'Гусеница',
//   weight: 0,
//   rank: 100,
//   class: 'none',
//   life: 3,
//   img: 'caterhead',
//   akt: (akt) => {
//     let akts = []
//     if (akt.me.energy > 0) {
//       akt.near().forEach((p) => {
//         let img = 'move';
//         if (en.unitInPoint(akt.game, p.x, p.y)) {
//           img = "eat";
//         } else
//           img = 'move'
//         akts.push({ x: p.x, y: p.y, img });
//       });
//     }
//     return akts
//   },
//   move: (wd) => {
//     let lx = wd.me.x
//     let ly = wd.me.y
//     // wd.go(wd.target.x, wd.target.y);
//     wd.flywalk();
//     if (wd.me.body)
//       wd.me.body.forEach((b) => {
//         let nx = b.x;
//         let ny = b.y;
//         wd.teleport(b.x, b.y, lx, ly)
//         lx = nx
//         ly = ny
//       });

//   },
//   onDeath: (wd) => {
//     if (wd.me.sticker) {
//       en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3)
//       wd.me.sticker = false
//     }
//   },
//   eat: (wd) => {
//     let u = en.addUnit(wd.game, 'caterbody', wd.me.x, wd.me.y, wd.me.team, 3)
//     u.sticker = { tp: wd.target.unit.tp, team: wd.target.unit.team }
//     u.head = wd.me
//     if (!wd.me.body)
//       wd.me.body = [];
//     wd.me.body.unshift(u);
//     wd.disappear(wd.target.unit);
//     wd.flywalk();
//     // wd.tire();

//   },
// }

exports.zombie = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 100,
  rank: 50,
  class: 'none',
  life: 3,
  img: 'zombie',
  akt: (akt) => {
    return akt.move().concat(akt.hand('zombie'))
  },
  move: (wd) => {
    wd.walk();
  },
  zombie: (wd) => {
    if (wd.target.unit.status.includes('zombie')) {
      wd.target.unit.status.remove('zombie')
      wd.target.unit.tp = 'zombie';
      wd.changeTeam(wd.target.unit);
      wd.target.unit.isReady = false;
    }
    else
      wd.addStatus('zombie');
    wd.tire();
  }
}

exports.diger = {
  name: 'Копатель', description: 'Меняет ландшафт, роет и закапывает ямы.',
  // life: 3,
  rank: 80,
  weight: 100,
  class: 'spec',
  img: 'diger',
  akt: (akt) => {
    let akts = akt.freemove()
    akts.forEach(e => e.img = 'fly');
    akts = akts.concat(akt.hand('diger'))
    // akts.push({
    //   x: akt.me.x,
    //   y: akt.me.y,
    //   img: 'diger',
    // });
    akts = akts.filter(a => {
      if (a.img == 'diger' && akt.game.field[a.x][a.y].slice(0, -1) == 'team')
        return false
      else
        return true
    });
    return akts
  },
  fly: (wd) => {
    wd.flywalk();
  },
  diger: (wd) => {
    // wd.flywalk();
    if (wd.game.field[wd.target.x][wd.target.y] == 'grass')
      wd.game.field[wd.target.x][wd.target.y] = 'ground'
    else if (wd.game.field[wd.target.x][wd.target.y] == 'ground')
      wd.game.field[wd.target.x][wd.target.y] = 'grass'
    else if (wd.game.field[wd.target.x][wd.target.y] == 'water')
      wd.game.field[wd.target.x][wd.target.y] = 'grass'
    wd.tire();
  }
}
// exports.glider = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 0,
//   life: 3,
//   class: 'spec',
//   img: 'glider',
//   akt: (akt) => {
//     let akts = akt.hand('glider')
//     akts = akts.filter(a => {
//       let dx = a.x - akt.me.x
//       let dy = a.y - akt.me.y
//       let tx = akt.me.x + dx
//       let ty = akt.me.y + dy
//       do {
//         tx += dx
//         ty += dy
//       } while (en.isOccupied(akt.game, tx, ty) == 1);
//       if (en.isOccupied(akt.game, tx, ty) == -1) {
//         // console.log(tx,ty)
//         return false
//       }
//       else return true;
//     })
//     akts = akts.concat(akt.move());
//     return akts
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   glider: (wd) => {
//     let dx = wd.target.x - wd.me.x
//     let dy = wd.target.y - wd.me.y
//     let tx = wd.me.x + dx
//     let ty = wd.me.y + dy
//     do {
//       wd.damage(tx, ty)
//       tx += dx
//       ty += dy
//     }
//     while (wd.unitInPoint(tx, ty));
//     wd.go(tx, ty)
//     wd.tire();
//   }
// }
exports.bush = {
  name: 'Куст',
  description: '...',
  // neutral: true,
  rank: 0,
  weight: 100,
  class: 'warrior',
  life: 3,
  img: 'bush',
  akt: (akt) => {
    let akts = []
    let points = en.allPoints();
    points = points.filter(pt => en.isOccupied(akt.game, pt.x, pt.y))
    points.forEach((pt) => {
      if (pt.x != akt.me.x || pt.y != akt.me.y) {
        akts.push({
          x: pt.x,
          y: pt.y,
          img: 'change',
        })
      }
    });
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  change: (wd) => {
    let x = wd.me.x
    let y = wd.me.y
    wd.kill(x, y);
    wd.teleport(wd.target.x, wd.target.y, x, y)
  }
}
exports.mashroom = {
  name: 'Гриб',
  description: 'Обычно он нейтрален. Обычно он просто растет. Растет медленно, поэтому в течении партии это никак незаметно.',
  // neutral: true,
  rank: 0,
  weight: 50,
  class: 'warrior',
  life: 3,
  img: 'mashroom',
  akt: (akt) => {
    return akt.move().concat(akt.hand('polymorph'))
  },
  move: (wd) => {
    wd.walk();
  },
  polymorph: (wd) => {
    let tp = _.sample(Object.keys(module.exports));
    wd.target.unit.tp = tp;
    wd.tire();
  }

}
exports.pusher = {
  name: 'Толкатель',
  description: 'Может занять место другого юнита вытолкнув его на соседнюю клетку, а если она тоже занята, то толкает весь ряд',
  rank: 70,
  weight: 100,
  class: 'none',
  life: 3,
  img: 'pusher',
  akt: (akt) => {
    let arr = akt.move()
    if (akt.me.energy > 0)
      arr = arr.concat(akt.hand('push'))
    return arr
  },
  move: (wd) => {
    wd.walk();
  },
  push: (wd) => {
    let x = (wd.target.unit.x - wd.me.x)
    let y = (wd.target.unit.y - wd.me.y)
    i = 0
    while (en.inField(wd.target.x + x * i, wd.target.y + y * i) && en.unitInPoint(wd.game, wd.target.x + x * i, wd.target.y + y * i)) {
      i++
    }
    for (z = i; z--; z < 0) {
      wd.teleport(wd.target.x + x * z, wd.target.y + y * z, wd.target.x + x * (z + 1), wd.target.y + y * (z + 1))
    }
    wd.go(wd.target.x, wd.target.y)
    wd.me.energy--
  }
}
exports.fountain = {
  name: 'Фонтан', description: 'Разливает воду по низине в которой находится. Когда стоит на траве, то просто ждет случая оказаться в низине.',
  // neutral: true,
  rank: 70,
  class: 'none',
  weight: 40,
  life: 3,
  img: 'fountain',
  akt: (akt) => {
    return akt.move()
  },
  move: (wd) => {
    wd.walk();
  },
}
exports.telepath = {
  name: 'Внушитель', description: 'Заставляет юнита соперника выполнить любой приказ',
  weight: 100,
  rank: 40,
  class: 'archer',
  life: 3,
  img: 'telepath',
  akt: (akt) => {
    let akts = akt.move().concat(akt.hand('telepath', 'enemy'))
    // akts.forEach(e => e.img = 'hatchery');
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  telepath: (wd) => {
    wd.addStatus('telepath');
    wd.tire();
  }
}
exports.spliter = {
  name: 'Расщипитель', description: 'Разделяет юнита на три. Все три копии нестабильны и погибают после первого своего действия',
  weight: 100,
  rank: 145,
  class: 'spec',
  life: 3,
  img: 'spliter',
  akt: (akt) => {
    let akts = akt.move().concat(akt.hand('spliter'))
    // akts.forEach(e => e.img = 'hatchery');
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  spliter: (wd) => {
    wd.addStatus('spliter');
    // console.log(wd.target);
    let u = wd.addUnit(wd.target.unit.tp, wd.target.x + (wd.target.x - wd.me.x), wd.target.y + (wd.target.y - wd.me.y), wd.target.unit.team)
    let u2 = wd.addUnit(wd.target.unit.tp, wd.target.x + (wd.target.x - wd.me.x) * 2, wd.target.y + (wd.target.y - wd.me.y) * 2, wd.target.unit.team)
    if (u)
      u.status.push('spliter')
    if (u2)
      u2.status.push('spliter')
    wd.tire();
  }
}
// exports.hatchery = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 0,
//   life: 3,
//   rank: 160,
//   class: 'none',
//   img: 'hatchery',
//   akt: (akt) => {
//     let akts = akt.move()
//     akts.forEach(e => e.img = 'hatchery');
//     return akts;
//   },
//   hatchery: (wd) => {
//     let u = wd.addUnit('mashroom')
//     // console.log(u)
//     wd.tire()
//     // console.log('zerg',u)
//     if (u)
//       u.isReady = false;
//   }
// }
exports.bird = {
  name: 'Бомба', description: 'В свой ход прыгает в любую точку карты или взрывается квадратром 3на3 уничтожая себя и все живое в радиусе одной клетки оставляя лишь пламя.',
  weight: 0,
  rank: 10,
  life: 3,
  class: 'spec',
  img: 'bird',
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    points = points.filter(pt => !en.isOccupied(akt.game, pt.x, pt.y))
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'move',
      })
    });
    // akts.push({
    //   x: akt.me.x,
    //   y: akt.me.y,
    //   img: 'bird',
    // });
    return akts;
  },
  move: (wd) => {
    wd.go(wd.target.x, wd.target.y);
    wd.tire();
  },
  onDeath: (wd) => {
    this.bird.boom(wd);
  },
  boom: (wd) => {
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (en.inField(wd.target.x + xx, wd.target.y + yy) && wd.game.field[wd.target.x + xx][wd.target.y + yy] == 'grass')
          wd.game.field[wd.target.x + xx][wd.target.y + yy] = 'ground'
      }
    }
    wd.disappear();
    wd.kill(wd.me.x - 1, wd.me.y - 1);
    wd.spoil('fire', wd.me.x - 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x, wd.me.y - 1);
    wd.spoil('fire', wd.me.x, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y - 1);
    wd.spoil('fire', wd.me.x + 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y);
    wd.spoil('fire', wd.me.x + 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y);
    wd.spoil('fire', wd.me.x - 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y + 1);
    wd.spoil('fire', wd.me.x - 1, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x, wd.me.y + 1);
    wd.spoil('fire', wd.me.x, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y + 1)
    wd.spoil('fire', wd.me.x + 1, wd.me.y + 1, false, 3);
    wd.spoil('fire', wd.me.x, wd.me.y, false, 3);
    wd.tire();
  },
  bird: (wd) => {
    this.bird.boom(wd);
  },
}

exports.plant = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 50,
  life: 3,
  rank: 60,
  class: 'none',

  // neutral: true,
  img: 'plant',
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    points = points.filter(pt => !en.isOccupied(akt.game, pt.x, pt.y))
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'plant',
      })
    });
    return akts;
  },
  // move: (wd) => {
  //   wd.go(wd.target.x, wd.target.y);
  //   wd.tire();
  // },
  plant: (wd) => {
    let u = wd.addUnit('plant', wd.target.x, wd.target.y, 3)
    if (u)
      u.isReady = false;
    wd.tire();
  }
}
exports.worm = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 100,
  life: 3,
  rank: 100,
  class: 'spec',
  img: 'worm',
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    // points = points.filter(pt => !en.isOccupied(akt.game, pt.x, pt.y))
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'worm',
      })
    });
    return akts;
  },
  worm: (wd) => {
    // for (i = wd.game.spoil.length; i--; i > 0) {
    //   if (wd.game.spoil[i].name == 'worm'
    //     && wd.game.spoil[i].data.unit == wd.me
    //     && wd.game.spoil[i].team == wd.game.turn
    //   ) {
    //     console.log(wd.game.spoil[i].data.unit)
    //     console.log(wd.me)
    //     wd.game.spoil.splice(i, 1)
    //   }
    // }
    wd.spoil('worm', wd.target.x, wd.target.y, { worm: wd.me }, wd.game.turn)
    wd.tire();
  },
}

exports.rocket = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 10,
  life: 3,
  rank: 100,
  // neutral: true,
  class: 'warrior',
  img: 'rocket',
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    // points = points.filter(pt => !en.isOccupied(akt.game, pt.x, pt.y))
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'rocket',
      })
    });
    return akts;
  },
  rocket: (wd) => {
    wd.spoil('rockettarget', wd.target.x, wd.target.y, { unit: wd.me, timer: 3 }, wd.game.turn)
    wd.tire();
  }
}

exports.landmine = {
  name: 'Мина', description: 'Выкапывается и уничтожает юнита, если он на нее наступил. Закапывается после каждого передвижения',
  weight: 100,
  rank: 115,
  class: 'archer',
  life: 3,
  img: 'landmine',
  akt: (akt) => {
    let akts = akt.move()
    akts.forEach(e => e.img = 'landmine');
    akts = akts.filter(a => {
      let sarr = en.spoilInPoint(akt.game, a.x, a.y).filter(s => {
        return s.name == 'landmine'
      });
      if (sarr.length > 0)
        return false
      return true
    });
    return akts;
  },
  landmine: (wd) => {
    wd.spoil('landmine', wd.target.x, wd.target.y, false, wd.me.team)
    wd.disappear(wd.me.x, wd.me.y);
  }
}

exports.plantik = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 0,
  life: 3,
  img: 'plantik',
  class: 'none',
  akt: (akt) => {
    // return [{ x: 5, y: 5, img: 'move' }]
    // return akt.move()
    // .concat(akt.hand('electric'))
    return []
  },
  move: (wd) => {
    wd.walk();

  },
}
exports.kicker = {
  weight: 100,
  rank: 50,
  name: 'Пинатель',
  description: 'Пинает юнита и тот летит до ближайшего препятствия по прямой. Если жертва пинка улетит за пределы поля, то уже никогда не вернется, потому что земля плоская.',
  class: 'none',
  life: 3,
  img: 'kicker',
  akt: (akt) => {
    // return [{ x: 5, y: 5, img: 'move' }]
    return akt.move().concat(akt.hand('kicker'))
  },
  move: (wd) => {
    wd.walk();
  },
  kicker: (wd) => {
    wd.tire();
    let x = (wd.target.unit.x - wd.me.x)
    let y = (wd.target.unit.y - wd.me.y)
    while (wd.isOccupied(wd.target.unit.x + x, wd.target.unit.y + y) == 0) {
      wd.move(wd.target.unit.x + x, wd.target.unit.y + y);
    }
    if (wd.isOccupied(wd.target.unit.x + x, wd.target.unit.y + y) == -1)
      wd.move(wd.target.unit.x + x, wd.target.unit.y + y);
    // wd.damage(wd.target.unit);
  }
}

// exports.teleporter = {
//   weight: 30,
//   rank: 50,
//   name: 'Телепортер',
//   description: 'Пинает юнита и тот летит до ближайшего препятствия по прямой. Если жертва пинка улетит за пределы поля, то уже никогда не вернется, потому что земля плоская.',
//   class: 'spec',
//   life: 3,
//   neutral: true,
//   img: 'teleporter',
//   akt: (akt) => {
//     // return [{ x: 5, y: 5, img: 'move' }]
//     return akt.move().concat(akt.hand('teleport'))
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   teleport: (wd) => {
//     wd.tire();
//     let points = en.allPoints();
//     points = points.filter(pt => !en.isOccupied(wd.game, pt.x, pt.y))
//     let p = _.sample(points)
//     wd.teleport(wd.target.x, wd.target.y, p.x, p.y)
//   }
// }

exports.slime = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 0,
  rank: 130,
  class: 'spec',
  img: 'slime',
  akt: (akt) => {
    // return [{ x: 5, y: 5, img: 'move' }]
    return akt.move()
    // .concat(akt.hand('electric'))
  },
  move: (wd) => {
    wd.walk();
  },

  // electric: (wd) => {
  //   let marks = new Map();
  //   marks.set(wd.target.x + '_' + wd.target.y, { x: wd.target.x, y: wd.target.y });
  //   let nw = true;
  //   while (nw) {
  //     nw = false;
  //     wd.game.unit.forEach((u) => {
  //       if (u != wd.me) {
  //         let npt = en.near(u.x, u.y)
  //         npt.forEach((n) => {
  //           if (marks.get(n.x + '_' + n.y)) {
  //             if (!marks.get(u.x + '_' + u.y)) {
  //               marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
  //               nw = true;
  //             }
  //           }
  //         });
  //       }
  //     });
  //   }
  //   marks.forEach((v, k, m) => {
  //     wd.damage(v.x, v.y);
  //   });
  //   wd.tire();
  // }
}

exports.bear = {
  name: 'незаполнено', description: 'пока не придумал',
  rank: 20,
  weight: 100,
  class: 'none',
  img: 'bear',
  akt: (akt) => {
    let akts = akt.move()
    let points = en.near(akt.me.x, akt.me.y);
    points = points.filter(pt => {
      // let x = (2 * akt.me.x - pt.x)
      // let y = (2 * akt.me.y - pt.y)
      // return en.isOccupied(akt.game, pt.x, pt.y) && en.isOccupied(akt.game, x, y) != 1
      return en.isOccupied(akt.game, pt.x, pt.y)
    });
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'bear',
      })
    });
    return akts
  },
  move: (wd) => {
    wd.walk();
  },
  bear: (wd) => {
    wd.tire();
    let x = (wd.me.x - wd.target.x)
    let y = (wd.me.y - wd.target.y)
    wd.kill(x + wd.me.x, y + wd.me.y);
    wd.move(x + wd.me.x, y + wd.me.y);
  }
}

exports.frog = {
  name: 'незаполнено', description: 'пока не придумал',
  weight: 100,
  rank: 30,
  class: 'warrior',
  life: 3,
  img: 'frog',
  akt: (akt) => {
    let akts = akt.move()
    let points = en.near(akt.me.x, akt.me.y);
    points = points.filter(pt => {
      let x = (2 * pt.x - akt.me.x)
      let y = (2 * pt.y - akt.me.y)
      if (akt.me.data.lastjump && pt.x == akt.me.data.lastjump.x && pt.y == akt.me.data.lastjump.y) return false
      return en.isOccupied(akt.game, pt.x, pt.y) && !en.isOccupied(akt.game, x, y)
    });
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: 'frog',
        data: {
          tx: (pt.x - akt.me.x) * 2 + akt.me.x,
          ty: (pt.y - akt.me.y) * 2 + akt.me.y,
        }
      })
    });
    return akts
  },
  move: (wd) => {
    wd.walk();
  },
  frog: (wd, data) => {
    wd.me.data.lastjump = {
      x: wd.target.x,
      y: wd.target.y,
    }
    wd.noenergy();
    // let x = (wd.target.x - wd.me.x) * 2;
    // let y = (wd.target.y - wd.me.y) * 2;
    wd.go(data.tx , data.ty );
    if (wd.target.unit.status.includes('frog')) {
      wd.target.unit.status.remove('frog')
      wd.target.unit.tp = 'frog';
      wd.changeTeam(wd.target.unit);
      wd.target.unit.isReady = false;
    }
    else {
      wd.me.status = wd.me.status.concat(wd.target.unit.status);
      wd.me.status.forEach((status) =>
        wd.addStatus(status))
    }
  }
}
// exports.drill = {
//   name: 'Крот',
//   description: '',
//   weight: 0,
//   rank: 30,
//   class: 'warrior',
//   life: 3,
//   img: 'drill',
//   akt: (akter) => {
//     let akts = []
//     akter.near().forEach(pt =>
//       akts.push({ img: 'dir', x: pt.x, y: pt.y }));
//     return akts
//   },
//   dir: (wd) => {
//     let x = wd.target.x - wd.me.x
//     let y = wd.target.y - wd.me.y
//     wd.me.data.dir = { x, y };
//     wd.tire();
//   }
// }
// exports.drillgun = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 100,
//   rank: 0,
//   class: 'none',
//   life: 3,
//   img: 'drillgun',
//   akt: (akter) => {
//     let akts = []
//     if (!akter.me.data.summoned)
//       akter.near().forEach(pt =>
//         akts.push({ img: 'newdrill', x: pt.x, y: pt.y }));
//     else
//       akts = akter.move();
//     return akts
//   },
//   move: (wd) => {
//     wd.walk();
//     wd.me.data.summoned = false;
//     wd.tire();
//   },
//   newdrill: (wd) => {
//     wd.kill(wd.target.x, wd.target.y)
//     let u = wd.addUnit('drill', wd.target.x, wd.target.y, 3)
//     if (u) {
//       u.isReady = false;
//       u.data.dir = {
//         x: wd.target.x - wd.me.x,
//         y: wd.target.y - wd.me.y,
//       }
//     }
//     wd.me.data.summoned = true;
//   }
// }