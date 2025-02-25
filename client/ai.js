const game = require("./game");
const meta = require("./meta");
const _ = require("lodash");
const en = require("./engine");
const send = require("./send");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logDebug(message) {
  // console.log(message); // Закомментируйте эту строку, чтобы отключить отладочные сообщения
}

// // Используем WeakSet для отслеживания юнитов, которые уже телепортировались
// const teleportUsedUnits = new Set();

// async function delayedOrder(gm, unit, action) {
//   logDebug(action);
//   game.order(gm, unit, action);
//   send.data(gm);
//   if (action.img === "teleport") {
//     if (teleportUsedUnits.has(unit)) {
//       logDebug("Юнит уже использовал телепортацию, игнорирую");
//       return;
//     }
//     teleportUsedUnits.add(unit);
//   }
//   if (action.img !== "teleport") {
//     await sleep(1000);
//   }
// }

// async function attackEnemy(unit, gm, team) {
//   let attackAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return unitInPoint && unitInPoint.team != team && unitInPoint.team != 3;
//   });

//   if (attackAct.length > 0) {
//     logDebug("атакую врага");
//     await delayedOrder(gm, unit, _.sample(attackAct));
//     return true;
//   }
//   return false;
// }

// async function actNearEnemy(unit, gm, team) {
//   let nearEnemyAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return (
//       (!unitInPoint || unitInPoint.team != team) &&
//       en.near(a.x, a.y).some((pt) => {
//         const unitInPointNear = en.unitInPoint(gm, pt.x, pt.y);
//         return unitInPointNear && unitInPointNear.team != team && unitInPointNear.team != 3;
//       }) &&
//       (!unitInPoint || unitInPoint.team != team)
//     );
//   });

//   if (nearEnemyAct.length > 0) {
//     logDebug("рядом с врагом");
//     await delayedOrder(gm, unit, _.sample(nearEnemyAct));
//     return true;
//   }
//   return false;
// }

// async function stasisOnFriendlyUnit(unit, gm, team) {
//   let stasisAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return unitInPoint && unitInPoint.team === team && a.img === "stazis";
//   });

//   if (stasisAct.length > 0) {
//     logDebug("применяю стазис на союзного юнита");
//     await delayedOrder(gm, unit, _.sample(stasisAct));
//     return true;
//   }
//   return false;
// }

// async function attackNeutral(unit, gm) {
//   let attackNeutralAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return unitInPoint && unitInPoint.team == 3;
//   });

//   if (attackNeutralAct.length > 0) {
//     logDebug("атакую нейтрала");
//     await delayedOrder(gm, unit, _.sample(attackNeutralAct));
//     return true;
//   }
//   return false;
// }

// async function actNearNeutral(unit, gm) {
//   const nearNeutralAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return (
//       (!unitInPoint || unitInPoint.team !== unit.team) &&
//       en.near(a.x, a.y).some((pt) => {
//         const unitInPointNear = en.unitInPoint(gm, pt.x, pt.y);
//         return unitInPointNear && unitInPointNear.team === 3;
//       })
//     );
//   });

//   if (nearNeutralAct.length > 0) {
//     logDebug("рядом с нейтралом");
//     await delayedOrder(gm, unit, _.sample(nearNeutralAct));
//     return true;
//   }
//   return false;
// }

// async function captureFlag(unit, gm, team) {
//   let captureFlagAct = unit.akt.filter((a) => {
//     const fieldValue = en.fieldInPoint(gm, a.x, a.y);
//     return fieldValue && fieldValue.startsWith("team") && !fieldValue.endsWith(team.toString());
//   });
//   if (captureFlagAct.length > 0) {
//     logDebug("захватываю флаг");
//     await delayedOrder(gm, unit, _.sample(captureFlagAct));
//     return true;
//   }
//   return false;
// }

// async function moveToOwnFlag(unit, gm, team) {
//   let ownFlagAct = unit.akt.filter((a) => {
//     const fieldValue = en.fieldInPoint(gm, a.x, a.y);
//     return fieldValue && fieldValue.startsWith("team") && fieldValue.endsWith(team.toString());
//   });
//   if (ownFlagAct.length > 0) {
//     logDebug("двигаюсь к своему флагу");
//     await delayedOrder(gm, unit, _.sample(ownFlagAct));
//     return true;
//   }
//   return false;
// }

// // Функция teleportMove больше не нужна, так как логика отслеживания телепортации перенесена в delayedOrder

// async function moveToHighImp(unit, gm, team, imp) {
//   let highImpAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return imp[a.x][a.y] > 0 && (!unitInPoint || unitInPoint.team != team);
//   });
//   if (highImpAct.length > 0) {
//     logDebug("иду в важные точки");
//     await delayedOrder(gm, unit, _.sample(highImpAct));
//     return true;
//   }
//   return false;
// }

// async function randomMove(unit, gm, team) {
//   let randomAct = unit.akt.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return !unitInPoint || unitInPoint.team != team || unitInPoint == unit;
//   });

//   let nonBushAct = randomAct.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return !unitInPoint || unitInPoint.tp != "bush";
//   });

//   let bushAct = randomAct.filter((a) => {
//     const unitInPoint = en.unitInPoint(gm, a.x, a.y);
//     return unitInPoint && unitInPoint.tp == "bush";
//   });

//   let actionToTake;
//   if (nonBushAct.length > 0) {
//     actionToTake = _.sample(nonBushAct);
//   } else if (bushAct.length > 0) {
//     actionToTake = _.sample(bushAct);
//   } else {
//     actionToTake = _.sample(randomAct);
//   }

//   if (randomAct.length > 0) {
//     logDebug("хожу случайно");
//     await delayedOrder(gm, unit, actionToTake);
//     return true;
//   } else {
//     logDebug("Нет доступных действий для случайного выбора");
//   }
//   return false;
// }

// async function processUnits(gm, imp, team) {
//   // Сбрасываем список юнитов, использовавших телепортацию, в начале каждого хода
//   teleportUsedUnits.clear();
//   const processedUnits = new Set();
//   while (true) {
//     const readyUnits = gm.unit.filter(
//       (u) => (u.team == team || u.status.includes("telepath")) && !processedUnits.has(u)
//     );
//     if (readyUnits.length == 0) break;

//     const unit = _.sample(readyUnits);
//     logDebug(`следующий юнит ${unit.tp}, ${meta[unit.tp].ai}, ${unit.x} ${unit.y}`);

//     let actionCounter = 0;
//     do {
//       actionCounter++;
//       if (meta[unit.tp].ai == "seekAndDestroy" || meta[unit.tp].ai == undefined) {
//         if (await attackEnemy(unit, gm, team)) continue;
//         if (await stasisOnFriendlyUnit(unit, gm, team)) continue;
//         if (await actNearEnemy(unit, gm, team)) continue;
//         if (await captureFlag(unit, gm, team)) continue;
//         if (await moveToHighImp(unit, gm, team, imp)) continue;
//         if (await randomMove(unit, gm, team)) continue;
//       } else if (meta[unit.tp].ai == "neutralHunt") {
//         if (await attackNeutral(unit, gm)) continue;
//         if (await stasisOnFriendlyUnit(unit, gm, team)) continue;
//         if (await actNearNeutral(unit, gm)) continue;
//         if (await moveToOwnFlag(unit, gm, team)) continue;
//         if (await captureFlag(unit, gm, team)) continue;

//         if (await randomMove(unit, gm, team)) continue;
//       } else if (meta[unit.tp].ai == "random") {
//         if (await stasisOnFriendlyUnit(unit, gm, team)) continue;
//         if (await randomMove(unit, gm, team)) continue;
//       }
//     } while (unit.akt.length > 0 && actionCounter < 5);

//     processedUnits.add(unit);
//   }
// }

// exports.go = async (gm, team) => {
//   if (gm.turn != team) return;

//   let imp = [];
//   for (let y = 0; y < 9; y++) {
//     imp[y] = [];
//     for (let x = 0; x < 9; x++) {
//       imp[y][x] = 0;
//     }
//   }

//   gm.unit.forEach((u) => {
//     if (u.team != team && u.team != 3)
//       u.akt.forEach((a) => {
//         imp[a.x][a.y]++;
//       });
//   });

//   await processUnits(gm, imp, team);

//   game.endturn(gm, team);
//   logDebug("следующий ход");
// };

exports.go = async (gm, team) => {
  if (gm.turn != team) return;

  let hasActions = true;

  while (hasActions) {
    let bestMove = null;
    let teamScore = gm.position[team - 1];
    let opponentScore = gm.position[2 - team];
    let bestScoreDiff = (teamScore - opponentScore) / Math.max(opponentScore, 1);

    gm.unit.forEach((unit) => {
      if (unit.team !== team) return;

      unit.akt.forEach((action) => {
        let gmCopy = _.cloneDeep(gm);
        let unitCopy = en.unitInPoint(gmCopy, unit.x, unit.y);

        game.order(gmCopy, unitCopy, action);

        let newTeamScore = gmCopy.position[team - 1];
        let newOpponentScore = gmCopy.position[2 - team];

        let newScoreDiff = (newTeamScore - newOpponentScore) / Math.max(newOpponentScore, 1);
        // logDebug(
        //   `  ${unit.tp} ${action.img} x:${action.x} y:${action.y} соперник: ${opponentScore} -> ${newOpponentScore} команда: ${teamScore}->${newTeamScore}`
        // );
        if (newScoreDiff > bestScoreDiff) {
          bestScoreDiff = newScoreDiff;
          bestMove = {
            unit,
            action,
            newTeamScore,
            newOpponentScore,
          };
        }
      });
    });

    if (bestMove) {
      logDebug(
        `Юниту ${bestMove.unit.tp} выбран приказ: img: ${bestMove.action.img}, x: ${bestMove.action.x}, y: ${bestMove.action.y}`
      );
      logDebug(
        `Изменение позиции: команда ${team}: ${teamScore} -> ${bestMove.newTeamScore}, соперник: ${opponentScore} -> ${bestMove.newOpponentScore}`
      );
      game.order(gm, bestMove.unit, bestMove.action);
      send.data(gm);
    } else {
      logDebug("Ход улучшающий позицию не найден");
      break;
    }

    // Проверяем, остались ли еще акты
    hasActions = gm.unit.some((unit) => unit.team === team && unit.akt.length > 0);
    await sleep(1000);
  }

  game.endturn(gm, team);
  logDebug("Следующий ход");
};
