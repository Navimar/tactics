const animateWalk = (u, diff) => {
  let totalDuration = 1000;
  if (local.animationProgress > totalDuration) return false;

  let x =
    (u.x * (local.animationProgress / 500) +
      data.order.unit.x * ((totalDuration - local.animationProgress) / 500)) /
      2 -
    Math.sin(local.animationProgress / 25) / 150;
  let y =
    (u.y * (local.animationProgress / 500) +
      data.order.unit.y * ((totalDuration - local.animationProgress) / 500)) /
      2 -
    Math.sin(local.animationProgress / 25) / 45;

  drawUnit({ ...u, x, y });
  return true;
};

const animateFlight = (u, diff) => {
  let totalDuration = 1000;
  if (local.animationProgress > totalDuration) return false;

  let x =
    (u.x * (local.animationProgress / 500) +
      data.order.unit.x * ((totalDuration - local.animationProgress) / 500)) /
    2;
  let y =
    (u.y * (local.animationProgress / 500) +
      data.order.unit.y * ((totalDuration - local.animationProgress) / 500)) /
    2;

  drawUnit({ ...u, x, y });
  return true;
};

const animateShake = (u, diff) => {
  let totalDuration = 500;

  if (local.animationProgress > totalDuration) return false;

  let easingCoef = local.animationProgress / 1000;
  let easing = Math.pow(easingCoef - 1, 3) + 1;
  let x =
    u.x +
    (easing *
      (Math.cos(local.animationProgress * 0.1) + Math.cos(local.animationProgress * 0.3115))) /
      40;
  let y =
    u.y +
    (easing *
      (Math.sin(local.animationProgress * 0.05) + Math.sin(local.animationProgress * 0.057113))) /
      40;

  drawUnit({ ...u, x, y });

  return true;
};

const animateBreath = (u) => {
  let sizeAdd = 0;
  sizeAdd = (local.cadr / 700) * 15;
  drawUnit({ ...u, sizeAdd });
};

const animatePunch = (u, diff) => {
  totalDuration = 500;
  if (local.animationProgress > totalDuration) return false;

  // Определение направления движения на соседнюю клетку
  let targetX = data.order.akt.x; // Цель по X
  let targetY = data.order.akt.y; // Цель по Y

  // Изменяем расчёт так, чтобы движение происходило вперёд и обратно в течение полного цикла прогресса
  let cycleProgress = Math.PI * (local.animationProgress / totalDuration); // Период от 0 до PI
  let x = u.x + 0.5 * (targetX - u.x) * Math.sin(cycleProgress);
  let y = u.y + 0.5 * (targetY - u.y) * Math.sin(cycleProgress);

  drawUnit({ ...u, x, y });

  return true;
};

const animateTeleport = (u, diff) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.animationProgress > totalDuration) return false;

  let halfDuration = totalDuration / 2;
  let cropPercent;

  if (local.animationProgress <= halfDuration) {
    // Первая половина анимации - исчезновение
    cropPercent = 100 * (local.animationProgress / halfDuration); // От 0% до 100%
    drawUnit({ ...u, x: data.order.unit.x, y: data.order.unit.y, cropPercent });
  } else {
    // Вторая половина анимации - появление
    let x = data.order.akt.x; // Новая цель по X
    let y = data.order.akt.y; // Новая цель по Y
    cropPercent = 100 * ((totalDuration - local.animationProgress) / halfDuration); // От 100% до 0%
    drawUnit({ ...u, x, y, cropPercent });
  }
  return true;
};

const animateAdd = (u, diff) => {
  let totalDuration = 500; // Общая длительность анимации в миллисекундах
  if (local.animationProgress > totalDuration) return false;

  let cropPercent;

  cropPercent = 100 * ((totalDuration - local.animationProgress) / totalDuration); // От 100% до 0%
  drawUnit({ ...u, cropPercent });
  return true;
};

const animatePolymorph = (u, diff) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.animationProgress > totalDuration) return false;

  // let halfDuration = totalDuration / 2;
  let cropPercent;

  // if (local.animationProgress <= halfDuration) {
  cropPercent = 100 * (local.animationProgress / totalDuration); // От 0% до 100%
  let img = data?.order?.unit?.img;
  if (img) drawUnit({ ...u, img, cropPercent: -cropPercent }); // Используем старое изображение из data.order.unit.img

  cropPercent = 100 * ((totalDuration - local.animationProgress) / totalDuration); // От 100% до 0%
  drawUnit({ ...u, cropPercent }); // Используем новое изображение из unit.img
  // }
  return true;
};
