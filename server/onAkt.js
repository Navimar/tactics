import en from "./engine.js";
import meta from "./meta.js";
import akter from "./akter.js";

const exports = {};

exports.slime = (game, u) => {
  if (u.status.includes("slime")) {
    u.akt = u.akt.filter((a) => {
      if (a.img == "move" || a.img == "fly" || a.img == "take") {
        return false;
      } else {
        return true;
      }
    });
    u.akt.push({
      x: u.x,
      y: u.y,
      img: "kill",
    });
  }
};

exports.telepath = (game, u) => {
  // game.unit.forEach(u => {
  u.akt = u.akt.filter((a) => {
    if (a.img == "telepath" && en.unitInPoint(game, a.x, a.y)) {
      if (en.unitInPoint(game, a.x, a.y).status.includes("telepath")) return false;
      else return true;
    } else {
      return true;
    }
  });
  // });
};

exports.teleporter = (game, u) => {
  if (u.status.includes("teleporter")) {
    let akts = [];
    let points = en.allPoints();
    points = points.filter((pt) => !en.isOccupied(game, pt.x, pt.y));
    points = points.filter((pt) => en.fieldInPoint(game, pt.x, pt.y).slice(0, -1) != "team");
    points.forEach((pt) => {
      akts.push({
        x: pt.x,
        y: pt.y,
        img: "teleport",
      });
    });
    u.akt = akts;
  }
};

exports.teamPortal = (game, u) => {
  // Retrieve all points on the grid
  const allPoints = en.allPoints();

  // Determine the team field based on the unit's team
  const teamField = "team" + u.team;

  // Only proceed if the unit is ready and on its team field
  if (u.isReady && en.fieldInPoint(game, u.x, u.y) === teamField) {
    allPoints.forEach((point) => {
      // Check if the point is a team field and not the current unit's position
      if (
        en.fieldInPoint(game, point.x, point.y) === teamField &&
        !en.isOccupied(game, point.x, point.y)
      ) {
        // Add teleport action to the unit's 'akt' if conditions are met
        u.akt.push({ x: point.x, y: point.y, img: "teleport" });
      }
    });
  }
};

exports.worm = (game, u) => {
  for (let i = game.spoil.length; i--; i > 0) {
    if (game.spoil[i].name == "wormportal" && game.spoil[i].x == u.x && game.spoil[i].y == u.y) {
      let oldx = u.x;
      let oldy = u.y;
      u.x = game.spoil[i].data.worm.x;
      u.y = game.spoil[i].data.worm.y;
      u.akt = u.akt.concat(meta[u.tp].akt(akter(game, u)));
      // u.akt = meta[u.tp].akt(akter(game, u));
      u.x = oldx;
      u.y = oldy;
    }
  }
};

exports.stazis = (game, u) => {
  if (u.status.includes("stazis")) {
    u.akt = [];
    return;
  }
  // Фильтруем список текущих действий юнита
  u.akt = u.akt.filter((a) => {
    const unitAtPoint = en.unitInPoint(game, a.x, a.y);
    // Удаляем действия, если:
    // 1. В точке действия уже есть другой юнит
    // 2. Этот юнит находится в состоянии "стазис"
    // 3. Действие не связано со "стазисом" (то есть img не равно "stazis")
    if (
      unitAtPoint &&
      unitAtPoint.status.includes("stazis")
      // && a.img != "stazis"
    ) {
      return false; // Удаляем действие, так как нельзя воздействовать на юнита в стазисе
    } else {
      return true; // Оставляем действие, если вышеуказанные условия не выполнены
    }
  });

  // Создаем список действий, связанных со стазисом
  let stazisAkts = [];
  let points = en.near(u.x, u.y); // Получаем соседние точки относительно юнита

  // Фильтруем точки, чтобы оставить только те, где есть юниты в состоянии "стазис"
  points = points.filter((pt) => {
    let unitAtPoint = en.unitInPoint(game, pt.x, pt.y);
    return unitAtPoint && unitAtPoint.status.includes("stazis");
  });

  // Добавляем новые действия, связанные со стазисом, к списку действий юнита
  points.forEach((pt) => {
    stazisAkts.push({
      x: pt.x,
      y: pt.y,
      img: "unstazis", // Указываем изображение освобождения из стазиса для действия
    });
  });

  // Объединяем текущие действия юнита с новыми действиями, связанными со стазисом
  u.akt = u.akt.concat(stazisAkts);
};

// exports.flower = (game, u) => {
//   u.akt = u.akt.filter((a) => {
//     let t = en.unitInPoint(game, a.x, a.y)
//     if (t && t.team == 3 && en.isNear4(a.x, a.y, u.x, u.y))
//       return false
//     return true
//   })
//   u.akt = u.akt.concat(akter(game, u).hand('capture', 'neutral'))
// }

export default exports;
