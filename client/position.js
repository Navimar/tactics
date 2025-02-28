import en from "../server/engine.js";

function logDebug(message) {
  console.log(message); // Оставляем закомментированным
}

export default function (game) {
  let score = {
    t1: 0,
    t2: 0,
  };

  // Штраф за рыб на суше
  en.allUnitsOfType(game, "fish").forEach((unit) => {
    if (en.fieldInPoint(game, unit.x, unit.y) !== "water") {
      score[`t${unit.team}`] -= 30;
    }
  });
  console.log(en.allUnitsOfType(game, "base"));

  // 1) Даём 40 баллов, если нет базы
  if (!en.allUnitsOfType(game, "base").some((u) => u.team === 1)) score.t1 += 40; // 40 очков за отсутствие базы
  if (!en.allUnitsOfType(game, "base").some((u) => u.team === 2)) score.t2 += 40;

  // 2) Даём 50 баллов за каждого юнита, но 40 за грибы, если они принадлежат команде
  game.unit.forEach((unit) => {
    if (unit.team == 3) return;
    if (unit.tp === "mushroom") {
      score[`t${unit.team}`] += 40;
    } else {
      score[`t${unit.team}`] += 50;
    }
  });

  // 3) Даём от 15 до 0 очков за длину пути до ближайшего нейтрального гриба
  const neutralMushrooms = en.allUnitsOfType(game, "mushroom").filter((u) => u.team === 3);
  const bases = en.allUnitsOfType(game, "base").filter((u) => u.team === 1 || u.team === 2);

  bases.forEach((base) => {
    if (neutralMushrooms.length === 0) return;

    let minPathLength = Infinity;
    neutralMushrooms.forEach((mushroom) => {
      const path = en.path(game, base.x, base.y, mushroom.x, mushroom.y);
      if (path.length > 0) {
        // Если путь существует
        minPathLength = Math.min(minPathLength, path.length - 1); // -1, так как начальная точка не считается шагом
      }
    });

    const points = minPathLength === Infinity ? 0 : Math.max(0, 15 - minPathLength);
    if (base.team === 1) {
      score.t1 += points;
    } else if (base.team === 2) {
      score.t2 += points;
    }

    logDebug(
      `Base (Team ${base.team}) at (${base.x}, ${base.y}) to closest Mushroom: path length = ${minPathLength}, points = ${points}`
    );
  });

  game.unit.forEach((unit) => {
    if (unit.team == 3) return;

    const aktsOnEnemy = unit.akt.filter((akt) => {
      if (akt.img === "random" || akt.img === "change" || akt.img === "polymorph") return false;
      let u = en.unitInPoint(game, akt.x, akt.y);
      if (u && u.team !== 3 && u.team !== unit.team) {
        logDebug(`akt on ${u.tp} ${u.team} ${akt.x} ${akt.y} ${akt.img}`);
        return true;
      }
      return false;
    }).length;

    const pointsPerAct = unit.isReady ? 5 : 3;
    const totalPoints = aktsOnEnemy * pointsPerAct;
    if (totalPoints > 0) logDebug(`totalPoints ${totalPoints}`);
    score[`t${unit.team}`] += totalPoints;
  });

  // Записываем итоговые очки
  logDebug(`Final Score: Team 1 = ${score.t1}, Team 2 = ${score.t2}`);

  return [Math.round(score.t1), Math.round(score.t2)];
}
