import _ from "lodash";
import en from "./engine.js";

export default (game, me) => {
  return {
    me,
    game,
    near: () => {
      return en.near(me.x, me.y);
    },
    freemove: () => {
      let akts = [];
      let points = [{ x: me.x, y: me.y }];

      _.times(me.energy, () => {
        points.forEach((pt) => {
          let near = en.near(pt.x, pt.y);
          near = near.filter((np) => {
            return !en.isOccupied(game, np.x, np.y);
          });
          points = points.concat(near);
        });
      });
      points = removeDuplicates(points);
      points = points.filter((pt) => !en.isOccupied(game, pt.x, pt.y));

      points.forEach((pt) => {
        akts.push({
          x: pt.x,
          y: pt.y,
          img: "fly",
        });
      });
      return akts;
    },
    move: () => {
      let akts = [];
      let pointsMap = new Map();
      pointsMap.set(`${me.x},${me.y}`, 0);

      _.times(me.energy, () => {
        let newPoints = new Map();
        pointsMap.forEach((energySpent, ptStr) => {
          let [x, y] = ptStr.split(",").map(Number);
          let near = en.near(x, y);
          near.forEach((np) => {
            let npStr = `${np.x},${np.y}`;
            if (!pointsMap.has(npStr)) {
              let nf = en.fieldInPoint(game, np.x, np.y);
              let pf = en.fieldInPoint(game, x, y);
              if (
                !en.isOccupied(game, np.x, np.y) &&
                (nf === pf ||
                  _.includes(["team1", "team2", "water"], nf) ||
                  _.includes(["team1", "team2", "water"], pf))
              ) {
                newPoints.set(npStr, energySpent + 1);
              }
            }
          });
        });
        newPoints.forEach((energyCost, npStr) => {
          if (!pointsMap.has(npStr) || pointsMap.get(npStr) > energyCost) {
            pointsMap.set(npStr, energyCost);
          }
        });
      });

      pointsMap.forEach((energyCost, ptStr) => {
        let [x, y] = ptStr.split(",").map(Number);
        if (!en.isOccupied(game, x, y)) {
          akts.push({
            x: x,
            y: y,
            img: "move",
            data: { energyCost },
          });
        }
      });

      return akts;
    },
    hand: (img, who) => {
      let akts = [];
      let points = en.near(me.x, me.y);
      if (who == "ally") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (u && u.team == me.team) return true;
        });
      } else if (who == "notally") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (u && u.team != game.turn) return true;
        });
      } else if (who == "enemy") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (u && u.team != game.turn && u.team != 3) return true;
        });
      } else if (who == "notneutral") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (u && u.team != 3) return true;
        });
      } else if (who == "neutral") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (u && u.team == 3) return true;
        });
      } else if (who == "free") {
        points = points.filter((pt) => {
          let u = en.unitInPoint(game, pt.x, pt.y);
          if (!u) return true;
        });
      } else {
        points = points.filter((pt) => en.isOccupied(game, pt.x, pt.y));
      }
      points.forEach((pt) => {
        akts.push({
          x: pt.x,
          y: pt.y,
          img,
        });
      });
      return akts;
    },
  };
};

function removeDuplicates(arr) {
  const result = [];
  const duplicatesIndices = [];
  // Перебираем каждый элемент в исходном массиве
  arr.forEach((current, index) => {
    if (duplicatesIndices.includes(index)) return;
    result.push(current);
    // Сравниваем каждый элемент в массиве после текущего
    for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
      const comparison = arr[comparisonIndex];
      const currentKeys = Object.keys(current);
      const comparisonKeys = Object.keys(comparison);

      // Проверяем длину массивов
      if (currentKeys.length !== comparisonKeys.length) continue;

      // Проверяем значение ключей
      const currentKeysString = currentKeys.sort().join("").toLowerCase();
      const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
      if (currentKeysString !== comparisonKeysString) continue;

      // Проверяем индексы ключей
      let valuesEqual = true;
      for (let i = 0; i < currentKeys.length; i++) {
        const key = currentKeys[i];
        if (current[key] !== comparison[key]) {
          valuesEqual = false;
          break;
        }
      }
      if (valuesEqual) duplicatesIndices.push(comparisonIndex);
    } // Конец цикла
  });
  return result;
}
