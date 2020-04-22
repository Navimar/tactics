const en = require('./engine');
const _ = require('lodash');

exports.warrior = {
  weight: 0,
  life: 3,
  img: 'warrior',
  akt: (akt) => {
    return akt.move().concat(akt.hand('warrior'))
  },
  move: (wd) => {
    wd.walk();
  },
  warrior: (wd) => {
    wd.damage();
    wd.tire();
  }
}

exports.firebat = {
  weight: 100,
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


exports.aerostat = {
  weight: 50,
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
    wd.kill(wd.target.unit);

    // wd.target.unit.small = true;
    wd.flywalk();
    wd.me.data.drop = false;
  },
  warrior: (wd) => {
    wd.damage();
    wd.tire();
  }
}

exports.zombie = {
  weight: 100,
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
  class: 'support',
  life: 3,
  weight: 25,
  img: 'diger',
  akt: (akt) => {
    let akts = akt.freemove().concat(akt.hand('diger'))
    akts.push({
      x: akt.me.x,
      y: akt.me.y,
      img: 'diger',
    });
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
    if (wd.game.field[wd.target.x][wd.target.y] == 'grass')
      wd.game.field[wd.target.x][wd.target.y] = 'ground'
    else if (wd.game.field[wd.target.x][wd.target.y] == 'ground')
      wd.game.field[wd.target.x][wd.target.y] = 'grass'
    else if (wd.game.field[wd.target.x][wd.target.y] == 'water')
      wd.game.field[wd.target.x][wd.target.y] = 'grass'
    // wd.tire();
  }
}
exports.glider = {
  weight: 0,
  life: 3,
  img: 'glider',
  akt: (akt) => {
    let akts = akt.hand('glider')
    akts = akts.filter(a => {
      let dx = a.x - akt.me.x
      let dy = a.y - akt.me.y
      let tx = akt.me.x + dx
      let ty = akt.me.y + dy
      do {
        tx += dx
        ty += dy
      } while (en.isOccupied(akt.game, tx, ty) == 1);
      if (en.isOccupied(akt.game, tx, ty) == -1) {
        // console.log(tx,ty)
        return false
      }
      else return true;
    })
    akts = akts.concat(akt.move());
    return akts
  },
  move: (wd) => {
    wd.walk();
  },
  glider: (wd) => {
    let dx = wd.target.x - wd.me.x
    let dy = wd.target.y - wd.me.y
    let tx = wd.me.x + dx
    let ty = wd.me.y + dy
    do {
      wd.damage(tx, ty)
      tx += dx
      ty += dy
    }
    while (wd.unitInPoint(tx, ty));
    wd.go(tx, ty)
    wd.tire();
  }
}
exports.mashroom = {
  neutral: true,
  weight: 10,
  life: 3,
  img: 'mashroom',
  akt: (akt) => {
    return akt.move()
  },
  move: (wd) => {
    wd.walk();
  },
  mashroom: (wd) => {
    wd.damage();
    wd.tire();
  }
}
exports.pusher = {
  weight: 100,
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
      wd.teleport(wd.game, wd.target.x + x * z, wd.target.y + y * z, wd.target.x + x * (z + 1), wd.target.y + y * (z + 1))
    }
    wd.go(wd.target.x, wd.target.y)
    wd.me.energy--
  }
}
exports.fountain = {
  neutral: true,
  weight: 3,
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
  weight: 50,
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
  weight: 40,
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
exports.hatchery = {
  weight: 25,
  life: 3,
  img: 'hatchery',
  akt: (akt) => {
    let akts = akt.move()
    akts.forEach(e => e.img = 'hatchery');
    return akts;
  },
  hatchery: (wd) => {
    let u = wd.addUnit('mashroom')
    // console.log(u)
    wd.tire()
    // console.log('zerg',u)
    if (u)
      u.isReady = false;
  }
}
exports.bird = {
  weight: 50,
  life: 3,
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
    akts.push({
      x: akt.me.x,
      y: akt.me.y,
      img: 'bird',
    });
    return akts;
  },
  move: (wd) => {
    wd.go(wd.target.x, wd.target.y);
    wd.tire();
  },
  bird: (wd) => {
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
    wd.kill();
    wd.spoil('fire', wd.me.x, wd.me.y, false, 3);
    wd.tire();
  }
}

exports.plant = {
  weight: 2,
  life: 3,
  neutral: true,
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
    let u = wd.addUnit('plantik', 2)
    u.isReady = false;

    wd.tire();
  }
}
exports.worm = {
  weight: 50,
  life: 3,
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
    wd.spoil('worm', wd.target.x, wd.target.y, { unit: wd.me }, wd.me.team)
    wd.tire();
  }
}

exports.plantik = {
  weight: 0,
  life: 3,
  img: 'plantik',
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
    wd.damage(wd.target.unit);
  }
}

exports.slime = {
  weight: 25,
  life: 3,
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
  weight: 100,

  life: 3,
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
  weight: 50,
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
      })
    });
    return akts
  },
  move: (wd) => {
    wd.walk();
  },
  frog: (wd) => {
    wd.me.data.lastjump = {
      x: wd.target.x,
      y: wd.target.y,
    }
    wd.noenergy();
    let x = (wd.target.x - wd.me.x) * 2
    let y = (wd.target.y - wd.me.y) * 2
    wd.go(x + wd.me.x, y + wd.me.y);
    if (wd.target.unit.status.includes('frog'))
      wd.kill(wd.target.unit);
    else
      wd.addStatus('frog');
  }
}


