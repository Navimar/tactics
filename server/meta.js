const en = require("./engine");
const _ = require("lodash");

// exports.warrior = {
//   name: "Воин",
//   description: "Подходит и наносит рану",
//   weight: 100,
//   rank: 0,
//   class: "basic",
//   life: 3,
//   img: "warrior",
//   akt: (akt) => {
//     return akt.move().concat(akt.hand("wound"));
//   },
//   move: (wd) => {
//     wd.walk();
//   },
// };

// exports.archer = {
//   name: 'Лучник', description: 'Ходит или стреляет. Наносит рану. Третья рана уничтожает юнита.',
//   weight: 100,
//   rank: 0,
//   class: 'norm',
//   life: 3,
//   img: 'archer',
//   akt: (akt) => {
//     let akts = []
//     let points = en.allPoints();
//     points = points.filter(pt => {
//       if (Math.abs(pt.x - akt.me.x) + Math.abs(pt.y - akt.me.y) <= akt.me.energy)
//         return true
//     });
//     points.forEach((pt) => {
//       let u = en.unitInPoint(akt.game, pt.x, pt.y)
//       if (u && u != akt.me && akt.me.energy == 3)
//         akts.push({
//           x: pt.x,
//           y: pt.y,
//           img: 'wound',
//         })
//     });
//     return akts.concat(akt.move())
//   },
//   move: (wd) => {
//     wd.walk();
//   },
// }

exports.fish = {
  name: "Рыба",
  description: "Убивает за три укуса. Не может ходить. Плавает.",
  weight: 100,
  rank: 0,
  class: "none",
  life: 3,
  img: "fish",
  akt: (akt) => {
    let akts = [];
    if (
      akt.game.field[akt.me.x][akt.me.y] == "water" ||
      akt.game.field[akt.me.x][akt.me.y].slice(0, -1) == "team"
    ) {
      let points = en.allPoints();
      points = points.filter((pt) => {
        if (
          Math.abs(pt.x - akt.me.x) + Math.abs(pt.y - akt.me.y) <= akt.me.energy &&
          !en.unitInPoint(akt.game, pt.x, pt.y) &&
          (akt.game.field[pt.x][pt.y] == "water" ||
            akt.game.field[pt.x][pt.y].slice(0, -1) == "team")
        )
          return true;
      });
      points.forEach((pt) => {
        if (!en.unitInPoint(akt.game, pt.x, pt.y))
          akts.push({
            x: pt.x,
            y: pt.y,
            img: "move",
          });
      });
    }
    return akts.concat(akt.hand("wound"));
  },
  move: (wd) => {
    wd.flywalk();
  },
};

exports.headcrab = {
  name: "Паразит",
  description: "Подчиняет разум. Медленно ползает.",
  weight: 100,
  rank: 0,
  class: "norm",
  life: 3,
  img: "headcrab",
  akt: (akt) => {
    return akt.hand("move", "free").concat(akt.hand("headcrab"));
    // return akt.hand("headcrab");
  },
  headcrab: (wd) => {
    wd.target.unit.team = wd.me.team;
    wd.target.unit.sticker = { tp: wd.me.tp, team: wd.me.team };
    // wd.target.unit.isReady = false;
    wd.disappear(wd.me);
    // wd.kill(wd.me);
  },
  move: (wd) => {
    wd.walk();
    wd.tire();
  },
  // onAppear: (wd) => {
  //   wd.me.status.push('spliter');
  // }
};

// exports.snail = {
//   name: "Улитка",
//   description: "Ходит на одну клетку, давит юнитов и оставляет огненный след",
//   weight: 100,
//   rank: 0,
//   class: "norm",
//   life: 3,
//   img: "snail",
//   akt: (akt) => {
//     let akts = [];
//     let initialPoint = `${akt.me.x},${akt.me.y}`;
//     let pointsSet = new Set([initialPoint]);

//     // Распространение волны для клеток abyss
//     while (true) {
//       let newPoints = [];
//       pointsSet.forEach((ptStr) => {
//         let [x, y] = ptStr.split(",").map(Number);
//         if (
//           (en.fieldInPoint(akt.game, x, y) === "abyss" &&
//             !en.isOccupied(akt.game, x, y)) ||
//           (x == akt.me.x && y == akt.me.y)
//         )
//           en.near(x, y).forEach((nearPoint) => {
//             let nearPointStr = `${nearPoint.x},${nearPoint.y}`;
//             if (!pointsSet.has(nearPointStr)) newPoints.push(nearPointStr);
//           });
//       });

//       if (newPoints.length === 0) {
//         break; // Выход из цикла, если нет новых точек для перемещения
//       }

//       newPoints.forEach((npStr) => pointsSet.add(npStr));
//     }
//     pointsSet.forEach((ptStr) => {
//       let [x, y] = ptStr.split(",").map(Number);
//       if (en.fieldInPoint(akt.game, x, y) != "abyss") {
//         if (!en.isOccupied(akt.game, x, y)) akts.push({ x, y, img: "move" });
//         if (en.isOccupied(akt.game, x, y) && (x != akt.me.x || y != akt.me.y))
//           akts.push({ x, y, img: "snail" });
//       }
//     });

//     return akts;
//   },

//   snail: (wd) => {
//     // wd.spoil("fire", wd.me.x, wd.me.y, false, 3);
//     wd.terraform(wd.me.x, wd.me.y, "abyss");
//     wd.kill();
//     wd.walk();
//     wd.tire();
//   },
//   move: (wd) => {
//     // wd.spoil("fire", wd.me.x, wd.me.y, false, 3);
//     wd.terraform(wd.me.x, wd.me.y, "abyss");
//     wd.walk();
//     wd.tire();
//   },
// };

// exports.mine = {
//   name: "Шахта",
//   description: "Приносит три золота в конце хода",
//   weight: 100,
//   rank: 0,
//   class: "norm",
//   life: 3,
//   img: "mine",
//   akt: (akt) => {
//     return [];
//   },
//   move: (wd) => {
//     wd.walk();
//   },
// };

// exports.hoplite = {
//   name: "Обратный гоплит",
//   description:
//     "Обратный гоплит. Бросает себя вместо копья. Подберите копье, чтобы броситься снова.",
//   weight: 100,
//   rank: 0,
//   class: "norm",
//   life: 3,
//   img: (wd) => {
//     let img = "hoplite";
//     if (wd.me.data.spear) img = "hoplite2";
//     return img;
//   },
//   akt: (akt) => {
//     let akts = [];
//     if (!akt.me.data.spear) {
//       let points = en.allPoints();
//       points = points.filter((pt) => {
//         if (Math.abs(pt.x - akt.me.x) + Math.abs(pt.y - akt.me.y) <= akt.me.energy) return true;
//       });
//       points.forEach((pt) => {
//         let u = en.unitInPoint(akt.game, pt.x, pt.y);
//         if (u && u != akt.me && akt.me.energy == 3)
//           akts.push({
//             x: pt.x,
//             y: pt.y,
//             img: "hoplite",
//           });
//       });
//     }
//     return akts.concat(akt.move());
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   hoplite: (wd) => {
//     wd.me.data.spear = true;
//     wd.spoil("spear", wd.me.x, wd.me.y, false, 3);
//     wd.kill();
//     wd.go(wd.target.x, wd.target.y);
//     wd.tire();
//   },
// };

exports.base = {
  name: "Лиса",
  description:
    "Главный юнит, он вербует нейтральные грибы в свою армию! А еще может превращать юнитов в случайных.",
  weight: 100,
  rank: 0,
  class: "norm",
  life: 3,
  img: "base",
  akt: (akt) => {
    let akts = akt
      .move()
      .concat(akt.hand("capture", "neutral"))
      // .concat(akt.hand('capture', 'neutral'))
      .concat(akt.hand("polymorph", "notneutral"));
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  // onDeath: (wd) => {
  //   wd.spoil("egg", wd.me.x, wd.me.y, { tp: "base", team: wd.me.team }, 3);
  // },
};

exports.merchant = {
  name: "Упаковщик",
  description: "Упаковывает юнита в коробочку. Из коробки можно выбраться в свой ход.",
  weight: 100,
  rank: 30,
  class: "norm",
  life: 3,
  img: "merchant",
  akt: (akt) => {
    return akt.move().concat(akt.hand("trade"));
  },
  move: (wd) => {
    wd.walk();
  },
  trade: (wd) => {
    wd.disappear();
    let u = wd.addUnit("box", wd.target.x, wd.target.y, wd.target.unit.team);
    u.sticker = { tp: wd.target.unit.tp, team: wd.target.unit.team };

    wd.tire();
  },
};

// exports.chicken = {
//   name: "Уменьшитель",
//   description:
//     "Превращает юнита в яйцо. В конце хода юнит благополучно вылупится обратно, если конечно никто ему не помешает",
//   weight: 100,
//   rank: 150,
//   class: "norm",
//   life: 3,
//   img: "chicken",
//   akt: (akt) => {
//     return akt.move().concat(akt.hand("chicken"));
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   chicken: (wd) => {
//     wd.spoil(
//       "egg",
//       wd.target.x,
//       wd.target.y,
//       { tp: wd.target.unit.tp, team: wd.target.unit.team },
//       3,
//     );
//     wd.disappear(wd.target.unit);
//     wd.tire();
//   },
// };

exports.firebat = {
  description: "Поджигает. Горящий юнит в конце своего хода сгорает.",
  name: "Поджигатель",
  weight: 100,
  rank: 80,
  class: "norm",
  life: 3,
  img: "firebat",
  akt: (akt) => {
    let arr = akt.move();
    let far = akt.hand("firebat");
    if (far) {
      far = far.filter((e) => {
        if (
          en.unitInPoint(akt.game, e.x, e.y).status == "fire" ||
          en.unitInPoint(akt.game, e.x, e.y).status == "fire2"
        )
          return false;
        if (akt.game.field[e.x][e.y] == "water") return false;
        return true;
      });
      arr = arr.concat(far);
    }
    return arr;
  },
  move: (wd) => {
    wd.walk();
  },
  firebat: (wd) => {
    wd.addStatus("fire");
    wd.tire();
  },
};

// exports.bomber = {
//   description: 'Прилепляет бомбу на юнита, потом исчезает. Юнит с прилепленной бомбой при смерти взрывается квадратом 3х3',
//   name: 'Бомбер',
//   weight: 100,
//   rank: 80,
//   class: 'norm',
//   life: 3,
//   img: 'bomber',
//   akt: (akt) => {
//     let arr = akt.move()
//     arr = arr.concat(akt.hand('bomber'))
//     return arr
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   bomber: (wd) => {
//     wd.addStatus('bomber');
//     wd.disappear(wd.me);
//     // wd.tire();
//   }
// }

// exports.teleporter = {
//   description: "Оглушает",
//   name: "Телепортер",
//   weight: 100,
//   rank: 80,
//   class: "warrior",
//   life: 3,
//   img: "teleporter",
//   akt: (akt) => {
//     let arr = akt.move();
//     let far = akt.hand("teleporter");
//     if (far) {
//       far = far.filter((e) => {
//         if (en.unitInPoint(akt.game, e.x, e.y).status == "teleporter") return false;
//         return true;
//       });
//       arr = arr.concat(far);
//     }
//     return arr;
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   teleporter: (wd) => {
//     wd.addStatus("teleporter");
//     wd.tire();
//     let tx = wd.target.x;
//     let ty = wd.target.y;
//     let mx = wd.me.x;
//     let my = wd.me.y;
//     wd.me.x = tx;
//     wd.me.y = ty;
//     wd.me.m = !wd.me.m;
//     wd.target.unit.x = mx;
//     wd.target.unit.y = my;
//     wd.target.unit.m = !wd.target.unit.m;
//   },
// };

exports.staziser = {
  description:
    "Помещает юнита в стазис, а может наоборот освободить. Если количество стазисников на поле уменьшается, то все стазисы пропадают",
  name: "Поджигатель",
  weight: 100,
  rank: 80,
  class: "norm",
  life: 3,
  img: "staziser",
  akt: (akt) => {
    return akt.move().concat(akt.hand("stazis"));
  },
  move: (wd) => {
    wd.walk();
  },
  stazis: (wd) => {
    if (wd.target.unit.status.includes("stazis")) wd.target.unit.status.remove("stazis");
    else wd.addStatus("stazis");
    wd.tire();
  },
  //  onDeath: (wd) => {
  //    wd.game.unit.forEach(u => u.status.remove('stazis'));
  //  }
};

// exports.lover = {
//   description: 'Налкадывает сердечки на юнитов по цепочке от целевого. Если на поле не останется ни одного Любовника, то все влюбленные погибают.',
//   name: 'Влюбленный',
//   weight: 100,
//   rank: 80,
//   class: 'norm',
//   life: 3,
//   img: 'lover',
//   akt: (akt) => {
//     let arr = akt.move()
//     let far = akt.hand('love')
//     if (far) {
//       far = far.filter(e => {
//         if (en.unitInPoint(akt.game, e.x, e.y).status == 'love')
//           return false
//         return true
//       });
//       arr = arr.concat(far)
//     }
//     return arr
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   love: (wd) => {
//     let marks = new Map();
//     marks.set(wd.target.x + '_' + wd.target.y, { x: wd.target.x, y: wd.target.y });
//     let nw = true;
//     while (nw) {
//       nw = false;
//       wd.game.unit.forEach((u) => {
//         if (u != wd.me) {
//           let npt = en.near(u.x, u.y)
//           npt.forEach((n) => {
//             if (marks.get(n.x + '_' + n.y)) {
//               if (!marks.get(u.x + '_' + u.y)) {
//                 marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
//                 nw = true;
//               }
//             }
//           });
//         }
//       });
//     }
//     marks.forEach((v, k, m) => {
//       wd.addStatus('love', v.x, v.y);
//     });
//     wd.tire();
//   },
// }

exports.aerostat = {
  description:
    "Загружает и разгружает юнитов. Юнит после разгрузки всегда здоров и может дейстовать, даже если уже ходил.",
  name: "Медиэвак",
  weight: 100,
  rank: 100,
  class: "norm",
  life: 3,
  img: "aerostat",
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    points = points.filter((pt) => {
      if (Math.abs(pt.x - akt.me.x) + Math.abs(pt.y - akt.me.y) <= akt.me.energy) return true;
    });
    points.forEach((pt) => {
      let u = en.unitInPoint(akt.game, pt.x, pt.y);
      if (u && u.tp != "aerostat")
        akts.push({
          x: pt.x,
          y: pt.y,
          img: "take",
        });
      else if (!u)
        akts.push({
          x: pt.x,
          y: pt.y,
          img: "fly",
        });
    });
    if (akt.me.sticker && akt.me.data.drop == false) {
      akts.push({
        x: akt.me.x,
        y: akt.me.y,
        img: "drop",
      });
    }
    if (akt.me.sticker && akt.me.data.drop == true) {
      akts.push({
        x: akt.me.x,
        y: akt.me.y,
        img: "undrop",
      });
    }
    return akts;
  },
  // onDisappear: true,
  fly: (wd) => {
    let x = wd.me.x;
    let y = wd.me.y;
    wd.flywalk();
    if (wd.me.data.drop) {
      if (wd.me.sticker) {
        en.addUnit(wd.game, wd.me.sticker.tp, x, y, wd.me.sticker.team);
        wd.me.sticker = false;
      }
    }
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
    let x = wd.me.x;
    let y = wd.me.y;
    let sticker = { tp: wd.target.unit.tp, team: wd.target.unit.team };
    wd.disappear(wd.target.unit);

    // wd.target.unit.small = true;
    wd.flywalk();
    if (wd.me.sticker) {
      en.addUnit(wd.game, wd.me.sticker.tp, x, y, wd.me.sticker.team, 3);
      wd.me.sticker = false;
    }
    wd.me.sticker = sticker;

    wd.me.data.drop = false;
  },
  // onDeath: (wd) => {
  //   if (wd.me.sticker) {
  //     en.addUnit(
  //       wd.game,
  //       wd.me.sticker.tp,
  //       wd.me.x,
  //       wd.me.y,
  //       wd.me.sticker.team,
  //       3,
  //     );
  //   }
  // },
};
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
  name: "Зомби",
  description: "Превращает в зомби за пару ударов. Бегите, он медленный!",
  weight: 100,
  rank: 50,
  class: "norm",
  life: 3,
  maxenergy: 1,
  img: "zombie",
  akt: (akt) => {
    return akt.move().concat(akt.hand("zombie"));
  },
  move: (wd) => {
    wd.walk();
  },
  zombie: (wd) => {
    if (wd.target.unit.sticker) {
      wd.kill(wd.target.unit);
    } else
      wd.target.unit.sticker = {
        tp: wd.me.tp,
        team: en.oppositeTeam(wd.target.unit.team),
      };
    wd.tire();
  },
};

// exports.digger = {
//   name: "Копатель",
//   description: "Меняет ландшафт, роет и закапывает ямы.",
//   // life: 3,
//   rank: 80,
//   weight: 100,
//   class: "norm",
//   img: "digger",
//   akt: (akt) => {
//     let akts = akt.move();
//     akts.forEach((e) => (e.img = "move"));
//     akts = akts.concat(akt.hand("digger"));
//     // akts.push({
//     //   x: akt.me.x,
//     //   y: akt.me.y,
//     //   img: 'diger',
//     // });
//     // akts = akts.filter(a => {
//     //   if (a.img == 'digger' && akt.game.field[a.x][a.y].slice(0, -1) == 'team')
//     //     return false
//     //   else
//     //     return true
//     // });
//     return akts;
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   digger: (wd) => {
//     if (wd.game.field[wd.target.x][wd.target.y] == "grass")
//       wd.game.field[wd.target.x][wd.target.y] = "ground";
//     else if (wd.game.field[wd.target.x][wd.target.y] == "ground")
//       wd.game.field[wd.target.x][wd.target.y] = "grass";
//     else if (wd.game.field[wd.target.x][wd.target.y] == "water")
//       wd.game.field[wd.target.x][wd.target.y] = "grass";
//     if (wd.game.field[wd.target.x][wd.target.y].slice(0, -1) == "team")
//       wd.kill(wd.target.unit);

//     wd.tire();
//   },
// };
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

// exports.bush = {
//   name: 'Куст',
//   description: 'Из куста неожиданно может выскочить юнит... и сразу ходить!',
//   // neutral: true,
//   rank: 0,
//   weight: 100,
//   class: 'neutral',
//   life: 3,
//   img: 'bush',
//   akt: (akt) => {
//     let akts = []
//     let points = en.allPoints();
//     points = points.filter(pt => {
//       let u = en.unitInPoint(akt.game, pt.x, pt.y)
//       if (u && u.team == akt.me.team)
//         return true
//     });
//     points.forEach((pt) => {
//       if (pt.x != akt.me.x || pt.y != akt.me.y) {
//         akts.push({
//           x: pt.x,
//           y: pt.y,
//           img: 'change',
//         })
//       }
//     });
//     return akts;
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   change: (wd) => {
//     let x = wd.me.x
//     let y = wd.me.y
//     wd.disappear(x, y);
//     wd.teleport(wd.target.x, wd.target.y, x, y)
//   },
//   // onDeath: (wd) => {
//   //   wd.addUnit(_.sample(Object.keys(this)), wd.target.x, wd.target.y, wd.me.team)
//   // }
// }

exports.box = {
  name: "Коробка",
  description: "Может выпустить юнита который прячется в ней",
  // neutral: true,
  rank: 0,
  weight: 100,
  class: "none",
  life: 3,
  img: "bush",
  akt: (akt) => {
    return [
      {
        x: akt.me.x,
        y: akt.me.y,
        img: "kill",
      },
    ];
  },
};

exports.mashroom = {
  name: "Гриб",
  description: "Превращается в любого юнита на поле, кроме Лисы",
  // neutral: true,
  rank: 0,
  weight: 100,
  class: "neutral",
  life: 3,
  img: "mashroom",
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    points = points.filter(
      (pt) => en.isOccupied(akt.game, pt.x, pt.y) && (pt.x != akt.me.x || pt.y != akt.me.y)
    );
    points.forEach((pt) => {
      let tp = en.unitInPoint(akt.game, pt.x, pt.y)?.tp;
      if (tp != "mashroom" && tp != "base") akts.push({ x: pt.x, y: pt.y, img: "change" });
      else akts.push({ x: pt.x, y: pt.y, img: "random" });
    });
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  change: (wd) => {
    wd.me.tp = wd.target.unit.tp;
    wd.game.trail.push({ img: "polymorph", x: wd.me.x, y: wd.me.y });
    wd.tire();
  },
  random: (wd) => {
    wd.polymorph(wd.me.x, wd.me.y);
    wd.tire();
  },
  // onAppear: (wd) => {
  //   wd.polymorph(wd.me.x, wd.me.y);
  // },
};

// exports.polymorpher = {
//   name: 'Маг',
//   description: 'Превращает юнита в случайного другого юнита',
//   rank: 0,
//   weight: 50,
//   class: 'norm',
//   life: 3,
//   img: 'polymorpher',
//   akt: (akt) => {
//     return akt.move().concat(akt.hand('polymorph'))
//   },
//   move: (wd) => {
//     wd.walk();
//   },
// }

// exports.oldmashroom = {
//   name: "Гриб",
//   description:
//     "Это волшебный гриб. Не срывать! Споры вызывают неконтролируемую полиморфию",
//   // neutral: true,
//   rank: 0,
//   weight: 50,
//   class: "neutral",
//   life: 3,
//   img: "mashroom",
//   akt: (akt) => {
//     return akt.move().concat(akt.hand("polymorph"));
//   },
//   move: (wd) => {
//     wd.walk();
//   },
//   onDeath: (wd) => {
//     wd.polymorph(wd.me.x - 1, wd.me.y - 1);
//     wd.polymorph(wd.me.x, wd.me.y - 1);
//     wd.polymorph(wd.me.x + 1, wd.me.y - 1);
//     wd.polymorph(wd.me.x + 1, wd.me.y);
//     wd.polymorph(wd.me.x - 1, wd.me.y);
//     wd.polymorph(wd.me.x - 1, wd.me.y + 1);
//     wd.polymorph(wd.me.x, wd.me.y + 1);
//     wd.polymorph(wd.me.x + 1, wd.me.y + 1);
//   },
//   onAppear: (wd) => {
//     wd.polymorph(wd.me.x, wd.me.y);
//   },
// };

exports.pusher = {
  name: "Бычок",
  description: "Толкается. Может даже вытолкать за пределы поля.",
  rank: 70,
  weight: 100,
  class: "norm",
  life: 3,
  img: "pusher",
  akt: (akt) => {
    let arr = akt.move();
    if (akt.me.energy > 0) arr = arr.concat(akt.hand("push"));
    return arr;
  },
  move: (wd) => {
    wd.walk();
  },
  push: (wd) => {
    let x = wd.target.unit.x - wd.me.x;
    let y = wd.target.unit.y - wd.me.y;
    i = 0;
    while (
      en.inField(wd.target.x + x * i, wd.target.y + y * i) &&
      en.unitInPoint(wd.game, wd.target.x + x * i, wd.target.y + y * i)
    ) {
      i++;
    }
    for (z = i; z--; z < 0) {
      wd.teleport(
        wd.target.x + x * z,
        wd.target.y + y * z,
        wd.target.x + x * (z + 1),
        wd.target.y + y * (z + 1)
      );
    }
    wd.go(wd.target.x, wd.target.y);
    wd.me.energy--;
  },
};
exports.fountain = {
  name: "Кит",
  description: "Разливает воду по низине в которой находится. Превращает юнитов в рыб",
  // neutral: true,
  rank: 70,
  class: "norm",
  weight: 40,
  life: 3,
  img: "fountain",
  akt: (akt) => {
    let akts = [];
    akts = akts.concat(akt.hand("fish"));
    akts = akts.filter((a) => {
      // if (akt.game.field[a.x][a.y] != 'water' ||
      if (en.unitInPoint(akt.game, a.x, a.y).tp == "fish") return false;
      else return true;
    });
    // akts = akts.concat(akt.hand('digger'));
    // akts = akts.filter(a => {
    //   let f = akt.game.field[a.x][a.y];
    //   if (a.img == 'digger' && (f.slice(0, -1) == 'team' || f == 'ground' || f == 'water'))
    //     return false
    //   else
    //     return true
    // });
    akts = akts.concat(akt.move());
    return akts;
  },
  move: (wd) => {
    // if (wd.game.field[wd.target.x][wd.target.y] == 'grass')
    //   wd.game.field[wd.target.x][wd.target.y] = 'ground'
    wd.flywalk();
  },
  fish: (wd) => {
    wd.target.unit.tp = "fish";
    wd.tire();
  },
};
exports.telepath = {
  name: "Телепат",
  description: "Заставляет юнита соперника или нейтрала выполнить любой приказ",
  weight: 100,
  rank: 40,
  class: "norm",
  life: 3,
  img: "telepath",
  akt: (akt) => {
    let akts = akt.move().concat(akt.hand("telepath", "notally"));
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  telepath: (wd) => {
    wd.addStatus("telepath");
    wd.tire();
  },
};
exports.spliter = {
  name: "Расщипитель",
  description: "Расщипляет юнита на два. Обе половины нестабильны и вскоре исчезают",
  weight: 100,
  rank: 145,
  class: "norm",
  life: 3,
  img: "spliter",
  akt: (akt) => {
    let akts = akt.move().concat(akt.hand("spliter"));
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  spliter: (wd) => {
    wd.addStatus("spliter");
    // console.log(wd.target);
    let u = wd.addUnit(
      wd.target.unit.tp,
      wd.target.x + (wd.target.x - wd.me.x),
      wd.target.y + (wd.target.y - wd.me.y),
      wd.target.unit.team
    );
    // let u2 = wd.addUnit(wd.target.unit.tp, wd.target.x + (wd.target.x - wd.me.x) * 2, wd.target.y + (wd.target.y - wd.me.y) * 2, wd.target.unit.team)
    if (u) u.status.push("spliter");
    // if (u2)
    //   u2.status.push('spliter')
    wd.tire();
  },
};
exports.hatchery = {
  name: "Рыбашня",
  description: "Кидается призрачными рыбами, которые кусаются и исчезают в конце хода",
  weight: 0,
  life: 3,
  rank: 160,
  class: "norm",
  img: "hatchery",
  akt: (akt) => {
    let akts = akt.freemove();
    akts.forEach((e) => (e.img = "hatchery"));
    return akts;
  },
  hatchery: (wd) => {
    let u = wd.addUnit("fish");
    if (u) {
      u.status.push("spliter2");
    }
    wd.tire();
    // if (u)
    //   u.isReady = false;
  },
};
exports.bomb = {
  name: "Бомба",
  description: "Взрывается квадратром 3х3 уничтожая и поджигая все. Или ходит или взрывается.",
  weight: 100,
  rank: 10,
  life: 3,
  class: "norm",
  img: "bomb",
  akt: (akt) => {
    let aktarr = akt.move();
    if (akt.me.energy == 3)
      aktarr = aktarr.concat({
        x: akt.me.x,
        y: akt.me.y,
        img: "bomb",
      });
    return aktarr;
  },
  onDeath: (wd) => {
    this.bomb.bomb(wd);
  },
  bomb: (wd) => {
    for (let xx = -1; xx <= 1; xx++) {
      for (let yy = -1; yy <= 1; yy++) {
        if (
          en.inField(wd.target.x + xx, wd.target.y + yy) &&
          wd.game.field[wd.target.x + xx][wd.target.y + yy] == "grass"
        )
          wd.game.field[wd.target.x + xx][wd.target.y + yy] = "ground";
      }
    }
    wd.disappear();
    wd.kill(wd.me.x - 1, wd.me.y - 1);
    wd.spoil("fire", wd.me.x - 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x, wd.me.y - 1);
    wd.spoil("fire", wd.me.x, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y - 1);
    wd.spoil("fire", wd.me.x + 1, wd.me.y - 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y);
    wd.spoil("fire", wd.me.x + 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y);
    wd.spoil("fire", wd.me.x - 1, wd.me.y, false, 3);
    wd.kill(wd.me.x - 1, wd.me.y + 1);
    wd.spoil("fire", wd.me.x - 1, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x, wd.me.y + 1);
    wd.spoil("fire", wd.me.x, wd.me.y + 1, false, 3);
    wd.kill(wd.me.x + 1, wd.me.y + 1);
    wd.spoil("fire", wd.me.x + 1, wd.me.y + 1, false, 3);
    wd.spoil("fire", wd.me.x, wd.me.y, false, 3);
    wd.tire();
  },
};

exports.plant = {
  name: "Дерево",
  description: "Выращивает себе нейтрального друга в любом месте. Не умеет ходить",
  weight: 50,
  life: 3,
  rank: 60,
  class: "norm",
  img: "plant",
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    points = points.filter(
      (pt) =>
        akt.game.field[pt.x][pt.y].slice(0, -1) != "team" && !en.isOccupied(akt.game, pt.x, pt.y)
    );
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: "plant",
      });
    });

    return akts;
  },
  // move: (wd) => {
  //   wd.go(wd.target.x, wd.target.y);
  //   wd.tire();
  // },
  plant: (wd) => {
    let u = wd.addUnit("plant", wd.target.x, wd.target.y, 3);
    if (u) u.isReady = false;
    wd.tire();
  },
};
exports.worm = {
  name: "Червь",
  description:
    "Укажите точку. В конце хода соперника Червь выскакивает в указнном месте. Если клетка окажется занятой юнитом, то Червь его уничтожит.",
  weight: 100,
  life: 3,
  rank: 100,
  class: "norm",
  img: "worm",
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();

    // Находим все spoil с именем 'wormportal' и data.worm, равным akt.me
    const wormportalSpoils = akt.game.spoil.filter(
      (s) => s.name === "wormportal" && s.data.worm === akt.me
    );

    // Фильтруем точки, исключая 'team', текущую позицию и места с wormportalSpoils
    points = points.filter(
      (pt) =>
        akt.game.field[pt.x][pt.y].slice(0, -1) != "team" &&
        (pt.x != akt.me.x || pt.y != akt.me.y) &&
        !wormportalSpoils.some((s) => s.x === pt.x && s.y === pt.y)
    );

    // Создание актов для отфильтрованных точек
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: "worm",
      });
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
    wd.spoil("worm", wd.target.x, wd.target.y, { worm: wd.me }, wd.game.turn);
    wd.tire();
  },
};

exports.rocket = {
  name: "Ракета",
  description: "Укажите точку назначения. В конце отсчета туда будет нанесен ракетный удар",
  weight: 10,
  life: 3,
  rank: 100,
  // neutral: true,
  class: "norm",
  img: (wd) => {
    let img = "rocket";
    for (i = wd.game.spoil.length; i--; i > 0) {
      if (wd.game.spoil[i].name == "rockettarget" && wd.game.spoil[i].data.unit == wd.me) {
        if (wd.game.spoil[i].data.timer == 3) img = "rocket3";
        if (wd.game.spoil[i].data.timer == 2) img = "rocket2";
        if (wd.game.spoil[i].data.timer == 1) img = "rocket1";
        if (wd.game.spoil[i].data.timer == 0) img = "rocket0";
      }
    }
    wd.me.m = false;
    return img;
  },
  akt: (akt) => {
    let akts = [];
    let points = en.allPoints();
    // points = points.filter(pt => !en.isOccupied(akt.game, pt.x, pt.y))
    let f = true;
    for (i = akt.game.spoil.length; i--; i > 0) {
      if (akt.game.spoil[i].name == "rockettarget" && akt.game.spoil[i].data.unit == akt.me) {
        f = false;
      }
    }
    if (f)
      points.forEach((pt) => {
        akts.push({
          x: pt.x,
          y: pt.y,
          img: "rocket",
        });
      });
    return akts;
  },
  rocket: (wd) => {
    wd.spoil("rockettarget", wd.target.x, wd.target.y, { unit: wd.me, timer: 3 }, wd.game.turn);
    wd.tire();
  },
};

// exports.landmine = {
//   name: "Мина",
//   description: "Закапывается после каждого передвижения, убивает любого кто на нее наступит",
//   weight: 100,
//   rank: 115,
//   class: "norm",
//   life: 3,
//   img: "landmine",
//   akt: (akt) => {
//     let akts = akt.move();
//     akts.forEach((e) => (e.img = "landmine"));
//     akts = akts.filter((a) => {
//       let sarr = en.spoilInPoint(akt.game, a.x, a.y).filter((s) => {
//         return s.name == "landmine";
//       });
//       if (sarr.length > 0) return false;
//       return true;
//     });
//     return akts;
//   },
//   landmine: (wd) => {
//     wd.spoil("landmine", wd.target.x, wd.target.y, false, wd.me.team);
//     wd.disappear(wd.me.x, wd.me.y);
//   },
// };

// exports.plantik = {
//   name: 'незаполнено', description: 'пока не придумал',
//   weight: 0,
//   life: 3,
//   img: 'plantik',
//   class: 'none',
//   akt: (akt) => {
//     // return [{ x: 5, y: 5, img: 'move' }]
//     // return akt.move()
//     // .concat(akt.hand('electric'))
//     return []
//   },
//   move: (wd) => {
//     wd.walk();

//   },
// }
exports.kicker = {
  weight: 100,
  rank: 50,
  name: "Пинатель",
  description: "Отправляет в полет до края поля или препятствия",
  class: "norm",
  life: 3,
  img: "kicker",
  akt: (akt) => {
    // return [{ x: 5, y: 5, img: 'move' }]
    return akt.move().concat(akt.hand("kicker"));
  },
  move: (wd) => {
    wd.walk();
  },
  kicker: (wd) => {
    wd.tire();
    let x = wd.target.unit.x - wd.me.x;
    let y = wd.target.unit.y - wd.me.y;

    // Толкаем целевой юнит, пока он не выйдет за пределы поля или не столкнется с другим юнитом
    while (true) {
      let newX = wd.target.unit.x + x;
      let newY = wd.target.unit.y + y;

      // Проверяем, находится ли новая позиция в пределах поля
      if (!en.inField(newX, newY)) {
        break;
      }

      // Проверяем, свободна ли новая позиция от других юнитов
      if (wd.isOccupied(newX, newY)) {
        i = 0;
        while (
          en.inField(newX + x * i, newY + y * i) &&
          wd.isOccupied(newX + x * i, newY + y * i)
        ) {
          i++;
        }
        for (z = i; z--; z < 0) {
          wd.teleport(newX + x * z, newY + y * z, newX + x * (z + 1), newY + y * (z + 1));
        }
        wd.move(newX, newY);
        break;
      }

      wd.move(newX, newY);
    }
  },
};

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
  name: "Замоченька",
  description: "Заковывает всех врагов по цепочке. Закованные юниты не могут ходить",
  weight: 100,
  rank: 130,
  class: "norm",
  img: "slime",
  akt: (akt) => {
    // return [{ x: 5, y: 5, img: 'move' }]
    return akt.move();
    // .concat(akt.hand('electric'))
  },
  move: (wd) => {
    wd.walk();
  },
};

//   electric: (wd) => {
//     let marks = new Map();
//     marks.set(wd.target.x + '_' + wd.target.y, { x: wd.target.x, y: wd.target.y });
//     let nw = true;
//     while (nw) {
//       nw = false;
//       wd.game.unit.forEach((u) => {
//         if (u != wd.me) {
//           let npt = en.near(u.x, u.y)
//           npt.forEach((n) => {
//             if (marks.get(n.x + '_' + n.y)) {
//               if (!marks.get(u.x + '_' + u.y)) {
//                 marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
//                 nw = true;
//               }
//             }
//           });
//         }
//       });
//     }
//     marks.forEach((v, k, m) => {
//       wd.damage(v.x, v.y);
//     });
//     wd.tire();
//   }
// }

exports.bear = {
  name: "Мишка",
  description:
    "Перебрасывает целевого юнита через себя и убивает юнита, находящегося на месте приземления",
  rank: 20,
  weight: 100,
  class: "norm",
  img: "bear",
  akt: (akt) => {
    let akts = akt.move();
    let points = en.near(akt.me.x, akt.me.y);
    points = points.filter((pt) => {
      // let x = (2 * akt.me.x - pt.x)
      // let y = (2 * akt.me.y - pt.y)
      // return en.isOccupied(akt.game, pt.x, pt.y) && en.isOccupied(akt.game, x, y) != 1
      return en.isOccupied(akt.game, pt.x, pt.y);
    });
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: "bear",
      });
    });
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  bear: (wd) => {
    wd.tire();
    let x = wd.me.x - wd.target.x;
    let y = wd.me.y - wd.target.y;
    wd.kill(x + wd.me.x, y + wd.me.y);
    wd.move(x + wd.me.x, y + wd.me.y);
  },
};

exports.frog = {
  name: "Прыг-скок",
  description:
    "Прыгает через юнитов. После двух прыжков в течении одного хода начинает убивать каждого кого перепрыгнет на этом ходу.",
  weight: 100,
  rank: 30,
  class: "norm",
  life: 3,
  img: "frog",
  akt: (akt) => {
    let akts = akt.move();
    let points = en.near(akt.me.x, akt.me.y);
    points = points.filter((pt) => {
      let x = 2 * pt.x - akt.me.x;
      let y = 2 * pt.y - akt.me.y;
      if (akt.me.data.lastjump && pt.x == akt.me.data.lastjump.x && pt.y == akt.me.data.lastjump.y)
        return false;
      return en.isOccupied(akt.game, pt.x, pt.y) && !en.isOccupied(akt.game, x, y);
    });
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: "frog",
        data: {
          tx: (pt.x - akt.me.x) * 2 + akt.me.x,
          ty: (pt.y - akt.me.y) * 2 + akt.me.y,
        },
      });
    });
    return akts;
  },
  move: (wd) => {
    wd.walk();
  },
  frog: (wd, data) => {
    wd.me.data.lastjump = {
      x: wd.target.x,
      y: wd.target.y,
    };
    wd.noenergy();
    // let x = (wd.target.x - wd.me.x) * 2;
    // let y = (wd.target.y - wd.me.y) * 2;
    wd.go(data.tx, data.ty);
    if (wd.me.status.includes("frog")) {
      wd.me.status.remove("frog");
      wd.me.status.push("frog2");
    } else if (wd.me.status.includes("frog2")) {
      wd.kill();
    } else {
      wd.me.status.push("frog");
    }
  },
};

// exports.drill = {
//   name: "Крот",
//   description: "",
//   weight: 0,
//   rank: 30,
//   class: "warrior",
//   life: 3,
//   img: "drill",
//   akt: (akter) => {
//     let akts = [];
//     akter.near().forEach((pt) => akts.push({ img: "dir", x: pt.x, y: pt.y }));
//     return akts;
//   },
//   dir: (wd) => {
//     let x = wd.target.x - wd.me.x;
//     let y = wd.target.y - wd.me.y;
//     wd.me.data.dir = { x, y };
//     а;
//     wd.tire();
//   },
// };
// exports.drillgun = {
//   name: "незаполнено",
//   description: "пока не придумал",
//   weight: 100,
//   rank: 0,
//   class: "none",
//   life: 3,
//   img: "drillgun",
//   akt: (akter) => {
//     let akts = [];
//     if (!akter.me.data.summoned)
//       akter
//         .near()
//         .forEach((pt) => akts.push({ img: "newdrill", x: pt.x, y: pt.y }));
//     else akts = akter.move();
//     return akts;
//   },
//   move: (wd) => {
//     wd.walk();
//     wd.me.data.summoned = false;
//     wd.tire();
//   },
//   newdrill: (wd) => {
//     wd.kill(wd.target.x, wd.target.y);
//     let u = wd.addUnit("drill", wd.target.x, wd.target.y, 3);
//     if (u) {
//       u.isReady = false;
//       u.data.dir = {
//         x: wd.target.x - wd.me.x,
//         y: wd.target.y - wd.me.y,
//       };
//     }
//     wd.me.data.summoned = true;
//   },
// };
