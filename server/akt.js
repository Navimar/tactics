const _ = require('lodash');
const en = require('./engine');

module.exports = (game, me) => {
  return {
    me,
    game,
    move: () => {
      let akts = []
      let points = [{ x: me.x, y: me.y }];

      _.times(me.energy, () => {
        points.forEach((pt) => {
          points = points.concat(en.near(pt.x, pt.y))
        });
        points = points.filter(pt =>
          !en.isOccupied(game, pt.x, pt.y)
        )
      })
      points = removeDuplicates(points);
      points = points.filter(pt => !en.isOccupied(game, pt.x, pt.y))

      points.forEach((pt) => {
        akts.push({
          x: pt.x,
          y: pt.y,
          img: 'move',
        })
      });
      return akts;
    },
    hand: (img, who) => {
      let akts = []
      let points = en.near(me.x, me.y);
      if (who == 'ally') {
        points = points.filter(pt => {
          let u = en.unitInPoint(game, pt.x, pt.y)
          if (u && u.team == me.team) return true;
        });
      } else if (who == 'enemy') {
        points = points.filter(pt => {
          let u = en.unitInPoint(game, pt.x, pt.y)
          if (u && u.team != game.turn) return true;
        });
      } else {
        points = points.filter(pt =>
          en.isOccupied(game, pt.x, pt.y)
        );
      }
      points.forEach((pt) => {
        akts.push({
          x: pt.x,
          y: pt.y,
          img,
        })
      });
      return akts
    },
  }
}

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