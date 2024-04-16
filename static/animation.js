const animateWalk = (u, diff) => {
  let progress;
  u.progress = (u.progress || 0) + diff;
  progress = u.progress > 1000 ? 1000 : u.progress;

  let x =
    (u.x * (progress / 500) + data.order.unit.x * ((1000 - progress) / 500)) / 2 -
    Math.sin(progress / 25) / 150;
  let y =
    (u.y * (progress / 500) + data.order.unit.y * ((1000 - progress) / 500)) / 2 -
    Math.sin(progress / 25) / 45;

  drawUnit(u, x, y);
};

const animateFlight = (u, diff) => {
  let progress;
  u.progress = (u.progress || 0) + diff;
  progress = u.progress > 1000 ? 1000 : u.progress;

  let x = (u.x * (progress / 500) + data.order.unit.x * ((1000 - progress) / 500)) / 2;
  let y = (u.y * (progress / 500) + data.order.unit.y * ((1000 - progress) / 500)) / 2;

  drawUnit(u, x, y);
};

const animateShake = (u, diff) => {
  let progress;
  u.progress = (u.progress || 0) + diff;
  if (u.progress > 500) {
    progress = 0;
  } else {
    progress = u.progress;
  }

  let easingCoef = progress / 1000;
  let easing = Math.pow(easingCoef - 1, 3) + 1;
  let x = u.x + (easing * (Math.cos(progress * 0.1) + Math.cos(progress * 0.3115))) / 40;
  let y = u.y + (easing * (Math.sin(progress * 0.05) + Math.sin(progress * 0.057113))) / 40;

  drawUnit(u, x, y);
};

const animateBreath = (u) => {
  let sizeAdd = 0;

  sizeAdd = (local.cadr * 20) / 1000;
  drawUnit(u, u.x, u.y, sizeAdd);
};

const animatePunch = (u, diff) => {
  totalDuration = 500;
  let progress;
  u.progress = (u.progress || 0) + diff;
  progress = u.progress > totalDuration ? totalDuration : u.progress;

  // Определение направления движения на соседнюю клетку
  let targetX = data.order.akt.x; // Цель по X
  let targetY = data.order.akt.y; // Цель по Y

  // Изменяем расчёт так, чтобы движение происходило вперёд и обратно в течение полного цикла прогресса
  let cycleProgress = Math.PI * (progress / totalDuration); // Период от 0 до PI
  let x = u.x + 0.5 * (targetX - u.x) * Math.sin(cycleProgress);
  let y = u.y + 0.5 * (targetY - u.y) * Math.sin(cycleProgress);

  drawUnit(u, x, y);
};

const animateTeleport = (u, diff) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  u.progress = (u.progress || 0) + diff;
  let progress = u.progress > totalDuration ? totalDuration : u.progress;

  let halfDuration = totalDuration / 2;
  let cropPercent;

  if (progress <= halfDuration) {
    // Первая половина анимации - исчезновение
    cropPercent = 100 * (progress / halfDuration); // От 0% до 100%
    drawUnit(u, data.order.unit.x, data.order.unit.y, 0, cropPercent);
  } else {
    // Вторая половина анимации - появление
    let newX = data.order.akt.x; // Новая цель по X
    let newY = data.order.akt.y; // Новая цель по Y
    cropPercent = 100 * ((totalDuration - progress) / halfDuration); // От 100% до 0%
    drawUnit(u, newX, newY, 0, cropPercent);
  }
};

const animateAdd = (u, diff) => {
  let totalDuration = 500; // Общая длительность анимации в миллисекундах
  u.progress = (u.progress || 0) + diff;
  let progress = u.progress > totalDuration ? totalDuration : u.progress;

  let cropPercent;

  cropPercent = 100 * ((totalDuration - progress) / totalDuration); // От 100% до 0%
  drawUnit(u, u.x, u.y, 0, cropPercent);
};

const animatePolymorph = (u, diff) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  u.progress = (u.progress || 0) + diff;
  let progress = u.progress > totalDuration ? totalDuration : u.progress;

  let halfDuration = totalDuration / 2;
  let cropPercent;

  if (progress <= halfDuration) {
    // Первая половина анимации - исчезновение старого юнита
    cropPercent = 100 * (progress / halfDuration); // От 0% до 100%

    drawUnit({ ...u, img: data?.order?.unit?.img }, u.x, u.y, 0, cropPercent); // Используем старое изображение из data.order.unit.img
  } else {
    // Вторая половина анимации - появление нового юнита
    cropPercent = 100 * ((totalDuration - progress) / halfDuration); // От 100% до 0%
    drawUnit(u, u.x, u.y, 0, cropPercent); // Используем новое изображение из unit.img
  }
};
