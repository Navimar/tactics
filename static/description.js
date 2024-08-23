let description_field = {
  grass: {
    name: "Трава",
    description: "По ней приятно гулять",
  },
  ground: {
    name: "Низина",
    description: "Юниты не могут свободно переходить с травы на низину и с низины на траву.",
  },
  team1: {
    name: "Ваша площадь",
    description:
      "Захватите все площади, чтобы победить. Ваши юниты могут свободно телепортироваться между вашими площадями.",
  },
  team2: {
    name: "Чужая площадь",
    description: "Если соперник захватит все площади, он победит, не допустите этого.",
  },
  water: {
    name: "Вода",
    description: "Юниты могут в ней плавать. Тушит огонь.",
  },
};
let description_spoil = {
  fire: "Большой огонь. Поджигает юнитов. Постепенно тухнет.",
  fire1: "Средний огонь. Поджигает юнитов. Скоро потухнет.",
  fire2: "Маленький огонь. Поджигает юнитов. Потухнет в конце хода.",
  airdrop: "Здесь вырастет гриб на следующий ход, если никто ему не помешает.",
};
let description_status = {
  fire: "Этот юнит сгорит в конце хода соперника.",
  fire2: "Этот юнит сгорит в конце хода.",
  stazis: "Юнит в стазисе. Не может ничего делать. Не может быть целью.",
  wound: "Юнит поцарапан. Еще две такие царапины и он погибнет.",
  teleporter:
    "Юнит захвачен портальной магией. Он не может ходить, но может один раз телепортироваться куда захочет",
  spliter2: "Этот юнит призрачный. Он исчезнет в конце хода.",
};
let description_notfound = "Описание не готово";
let description_unit = {
  warrior: {
    name: "Воин",
    description: "Подходит и наносит рану",
  },
  archer: {
    name: "Лучник",
    description: "Ходит или стреляет. Наносит рану. Третья рана уничтожает юнита.",
  },
  fish: {
    name: "Рыба",
    description: "Убивает за три укуса. Не может ходить. Плавает.",
  },
  headcrab: {
    name: "Паразит",
    description: "Подчиняет разум. Медленно ползает.",
  },
  mushroomking: {
    name: "Грибной король",
    description:
      "Ходит сквозь грибы на неограниченное расстояние. Оставляет на старом месте новый гриб. Давит врагов.",
  },
  base: {
    description:
      "Главный юнит, он вербует нейтральные грибы в свою армию! А еще может превращать юнитов в случайных.",
    name: "Лиса",
  },
  merchant: {
    name: "Упаковщик",
    description: "Упаковывает юнита в коробочку. Из коробки можно выбраться в свой ход.",
  },
  firebat: {
    name: "Поджигатель",
    description: "Поджигает. Горящий юнит в конце своего хода сгорает.",
  },
  staziser: {
    name: "Стазисер",
    description:
      "Помещает юнита в стазис, а может наоборот освободить. Если количество стазисников на поле уменьшается, то все стазисы пропадают.",
  },
  aerostat: {
    name: "Медиэвак",
    description:
      "Загружает и разгружает юнитов. Юнит после разгрузки всегда здоров и может дейстовать, даже если уже ходил.",
  },
  zombie: {
    name: "Зомби",
    description: "Превращает в зомби за пару ударов. Бегите, он медленный!",
  },
  mushroom: {
    name: "Гриб",
    description: "Превращается в любого юнита на поле, кроме Лисы",
  },
  pusher: {
    name: "Бычок",
    description: "Толкается. Может даже вытолкать за пределы поля.",
  },
  fountain: {
    name: "Кит",
    description: "Разливает воду по низине в которой находится. Превращает юнитов в рыб",
  },
  telepath: {
    name: "Телепат",
    description: "Заставляет юнита соперника или нейтрала выполнить любой приказ",
  },
  spliter: {
    name: "Расщипитель",
    description: "Расщипляет юнита на два. Обе половины нестабильны и вскоре исчезают",
  },
  naga: {
    name: "Нага",
    description: "Окружает цель кусачими нестабильными рыбами, которые исчезнут в конце хода",
  },
  hatchery: {
    name: "Рыбашня",
    description: "Кидается призрачными рыбами, которые кусаются и исчезают в конце хода",
  },
  bomb: {
    name: "Бомба",
    description: "Взрывается квадратром 3х3 уничтожая и поджигая все. Или ходит или взрывается.",
  },
  plant: {
    name: "Рыбалиста",
    description: "Выстреливает рыбой в свободное место на поле. Не умеет ходить",
  },
  worm: {
    name: "Червь",
    description:
      "Укажите точку. В конце хода соперника Червь выскакивает в указнном месте. Если клетка окажется занятой юнитом, то Червь его уничтожит.",
  },
  rocket: {
    name: "Ракета",
    description: "Укажите точку назначения. В конце отсчета туда будет нанесен ракетный удар",
  },
  box: {
    name: "Коробка",
    description: "Может выпустить юнита который прячется в ней",
  },
  kicker: {
    name: "Пинатель",
    description: "Отправляет в полет до края поля или препятствия",
  },
  slime: {
    name: "Замоченька",
    description: "Заковывает всех врагов по цепочке. Закованные юниты не могут ходить",
  },
  bear: {
    name: "Мишка",
    description:
      "Перебрасывает целевого юнита через себя и убивает юнита, находящегося на месте приземления",
  },
  frog: {
    name: "Прыг-скок",
    description:
      "Прыгает через юнитов. После двух прыжков в течении одного хода начинает убивать каждого кого перепрыгнет на этом ходу.",
  },
};
description_sticker = "В этом юните внутри находится ";
