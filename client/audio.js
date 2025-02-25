// Объект для хранения загруженных звуков
const sounds = {};

// Функция для загрузки звука, если он еще не загружен
function loadSound(filename) {
  if (!sounds[filename]) {
    sounds[filename] = new Howl({
      src: [`${filename}.wav`],
    });
  }
}

// Основная функция для воспроизведения звука с случайной громкостью и скоростью
function playSound(filename) {
  // Проверяем, загружен ли уже звук
  if (!sounds[filename]) {
    // Если звук не загружен, загружаем его
    loadSound(filename);
  }
  // Генерация случайной громкости и скорости
  let rate = randomFloat(0.8, 1.2); // Скорость воспроизведения от 0.8 до 1.2
  let volume = randomFloat(0.8, 1.0); // Громкость от 0.8 до 1.0

  // Устанавливаем свойства звука
  sounds[filename].stop().seek(0).rate(rate).volume(volume).play();
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
