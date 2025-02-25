const animateWalk = (u, fromX, fromY) => {
  let totalDuration = 1000;
  if (local.cadrProgress > totalDuration) return false;

  let x =
    (u.x * (local.cadrProgress / 500) + fromX * ((totalDuration - local.cadrProgress) / 500)) / 2 -
    Math.sin(local.cadrProgress / 25) / 150;
  let y =
    (u.y * (local.cadrProgress / 500) + fromY * ((totalDuration - local.cadrProgress) / 500)) / 2 -
    Math.sin(local.cadrProgress / 25) / 45;

  drawUnit({ ...u, x, y });
  return true;
};

const animateFlight = (u, fromX, fromY) => {
  let totalDuration = 1000;
  if (local.cadrProgress > totalDuration) return false;

  let x =
    (u.x * (local.cadrProgress / 500) + fromX * ((totalDuration - local.cadrProgress) / 500)) / 2;
  let y =
    (u.y * (local.cadrProgress / 500) + fromY * ((totalDuration - local.cadrProgress) / 500)) / 2;

  drawUnit({ ...u, x, y });
  return true;
};

const animateJump = (u, fromX, fromY) => {
  let totalDuration = 1000;
  if (local.cadrProgress > totalDuration) return false;

  let x =
    (u.x * (local.cadrProgress / 500) + fromX * ((totalDuration - local.cadrProgress) / 500)) / 2;
  let y =
    (u.y * (local.cadrProgress / 500) + fromY * ((totalDuration - local.cadrProgress) / 500)) / 2;
  let offset = -Math.sin(Math.PI * (local.cadrProgress / totalDuration));

  drawUnit({ ...u, x, y: y + offset });
  return true;
};

const animateTeleport = (u, fromX, fromY) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  let halfDuration = totalDuration / 2;
  let cropPercent;

  if (local.cadrProgress <= halfDuration) {
    // Первая половина анимации - исчезновение
    cropPercent = 100 * (local.cadrProgress / halfDuration); // От 0% до 100%
    drawUnit({ ...u, x: fromX, y: fromY, cropPercent });
  } else {
    // Вторая половина анимации - появление
    cropPercent = 100 * ((totalDuration - local.cadrProgress) / halfDuration); // От 100% до 0%
    drawUnit({ ...u, x: u.x, y: u.y, cropPercent });
  }
  return true;
};

const animateWorm = (u, fromX, fromY) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  let halfDuration = totalDuration / 2;
  let cropPercent;

  if (local.cadrProgress <= halfDuration) {
    // Первая половина анимации - исчезновение
    cropPercent = 100 * (local.cadrProgress / halfDuration); // От 0% до 100%
    drawUnit({ ...u, x: fromX, y: fromY + cropPercent / 100, cropPercent });
  } else {
    // Вторая половина анимации - появление
    cropPercent = 100 * ((totalDuration - local.cadrProgress) / halfDuration); // От 100% до 0%
    drawUnit({ ...u, x: u.x, y: u.y + cropPercent / 100, cropPercent });
  }
  return true;
};

const animateShake = (u) => {
  let totalDuration = 1000;

  if (local.cadrProgress > totalDuration) return false;

  let x = u.x;
  let y = u.y;
  if (local.cadrProgress > 200 && local.cadrProgress < 700) {
    let easingCoef = local.cadrProgress / totalDuration;
    let easing = Math.pow(easingCoef - 1, 3) + 1;
    x =
      u.x +
      (easing * (Math.cos(local.cadrProgress * 0.1) + Math.cos(local.cadrProgress * 0.3115))) / 40;
    y =
      u.y +
      (easing * (Math.sin(local.cadrProgress * 0.05) + Math.sin(local.cadrProgress * 0.057113))) /
        40;
  }
  drawUnit({ ...u, x, y });

  return true;
};

const animateBreath = (u) => {
  let sizeAdd = 0;
  sizeAdd = (local.cadr / 700) * 15;
  drawUnit({ ...u, sizeAdd });
};

const animatePunch = (u, targetX, targetY) => {
  totalDuration = 500;
  if (local.cadrProgress < totalDuration) {
    // Изменяем расчёт так, чтобы движение происходило вперёд и обратно в течение полного цикла прогресса
    let cycleProgress = Math.PI * (local.cadrProgress / totalDuration); // Период от 0 до PI
    let x = u.x + 0.5 * (targetX - u.x) * Math.sin(cycleProgress);
    let y = u.y + 0.5 * (targetY - u.y) * Math.sin(cycleProgress);

    drawUnit({ ...u, x, y });
  } else drawUnit({ ...u });

  return true;
};

const animateTrailDeath = (unit, x, y) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  let cropPercent;

  if (local.cadrProgress <= totalDuration) {
    cropPercent = (100 * (local.cadrProgress / totalDuration)) / 2; // От 0% до 100%
    drawUnit({ ...unit, x, y, cropPercent });
  }
  return true;
};

const animateAdd = (unit) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  let cropPercent;

  cropPercent = (100 * ((totalDuration - local.cadrProgress) / totalDuration)) / 2; // От 100% до 0%
  drawUnit({ ...unit, cropPercent });
  return true;
};

const animatePolymorph = (u, img) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  // let halfDuration = totalDuration / 2;
  let cropPercent;

  // if (local.cadrProgress <= halfDuration) {
  cropPercent = 100 * (local.cadrProgress / totalDuration); // От 0% до 100%
  drawUnit({ ...u, img, cropPercent: -cropPercent }); // Используем старое изображение из data.order.unit.img

  cropPercent = 100 * ((totalDuration - local.cadrProgress) / totalDuration); // От 100% до 0%
  drawUnit({ ...u, cropPercent }); // Используем новое изображение из unit.img
  // }
  return true;
};

const animateLookAround = (u) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  // Определяем направление в зависимости от времени анимации
  let m = Math.floor(local.cadrProgress / 250) % 2; // Чередование каждые 250 мс (0 или 1)

  drawUnit({ ...u, m });

  return true;
};

const animateLaunch = (u, x, y) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  y = y - (15 / totalDuration) * local.cadrProgress; // Увеличиваем смещение по Y на высоту экрана

  drawUnit({ ...u, x, y });
  return true;
};

const animateFall = (u, x, y) => {
  let totalDuration = 1000; // Общая длительность анимации в миллисекундах
  if (local.cadrProgress > totalDuration) return false;

  // Позиция начинается из-за границы сверху и движется к целевому значению y
  y = y - (15 / totalDuration) * (totalDuration - local.cadrProgress); // Падаем вниз из-за края

  drawUnit({ ...u, x, y, m: "upsidedown" }); // Добавляем 'upsidedown' для переворота юнита
  return true;
};
