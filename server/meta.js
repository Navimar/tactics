const en = require('./engine');



exports.warrior = {
    class: 'never',
    life: 3,
    img: 'warrior',
    akt: (akt) => {
        // return [{ x: 5, y: 5, img: 'move' }]
        return akt.move().concat(akt.hand('warrior'))
    },
    move: (wd) => {
        wd.walk();
    },
    warrior: (wd) => {
        wd.damage();
        wd.tire();
    }
}

exports.electric = {
    class: 'champion',
    life: 3,
    img: 'electric',
    akt: (akt) => {
        // return [{ x: 5, y: 5, img: 'move' }]
        return akt.move().concat(akt.hand('electric'))
    },
    move: (wd) => {
        wd.walk();
    },
    electric: (wd) => {
        let marks = new Map();
        marks.set(wd.target.x + '_' + wd.target.y, { x: wd.target.x, y: wd.target.y });
        let nw = true;
        while (nw) {
            nw = false;
            wd.game.unit.forEach((u) => {
                let npt = en.near(u.x, u.y)
                npt.forEach((n) => {
                    if (marks.get(n.x + '_' + n.y)) {
                        if (!marks.get(u.x + '_' + u.y)) {
                            marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
                            nw = true;
                        }
                    }
                });
            });
        }
        marks.forEach((v, k, m) => {
            if (!(v.x == wd.me.x && v.y == wd.me.y))
                wd.damage(v.x, v.y);
        });
        wd.tire();
    }
}

exports.bear = {
    class: 'champion',
    life: 3,
    img: 'bear',
    akt: (akt) => {
        let akts = akt.move()
        let points = en.near(akt.me.x, akt.me.y);
        points = points.filter(pt => {
            let x = (2 * akt.me.x - pt.x)
            let y = (2 * akt.me.y - pt.y)
            return en.isOccupied(akt.game, pt.x, pt.y) && !en.isOccupied(akt.game, x, y)
        });
        points.forEach((pt) => {
            akts.push({
                x: pt.x,
                y: pt.y,
                img: 'bear',
            })
        });
        return akts
    },
    move: (wd) => {
        wd.walk();
    },
    bear: (wd) => {
        wd.tire();
        let x = (wd.me.x - wd.target.x)
        let y = (wd.me.y - wd.target.y)
        wd.move(x + wd.me.x, y + wd.me.y);
        wd.damage(x + wd.me.x, y + wd.me.y);
    }
}


exports.frog = {
    class: 'champion',
    life: 3,
    img: 'frog',
    onEndturn: (wd) => {
        wd.me.data.lastjump = false;
        // console.log('ontire',wd.me);
    },
    akt: (akt) => {

        let akts = akt.move()
        let points = en.near(akt.me.x, akt.me.y);
        points = points.filter(pt => {
            let x = (2 * pt.x - akt.me.x)
            let y = (2 * pt.y - akt.me.y)
            if (akt.me.data.lastjump && pt.x == akt.me.data.lastjump.x && pt.y == akt.me.data.lastjump.y) return false
            return en.isOccupied(akt.game, pt.x, pt.y) && !en.isOccupied(akt.game, x, y)
        });
        points.forEach((pt) => {
            akts.push({
                x: pt.x,
                y: pt.y,
                img: 'frog',
            })
        });
        return akts
    },
    move: (wd) => {
        wd.walk();
    },
    frog: (wd) => {
        wd.me.data.lastjump = {
            x: wd.target.x,
            y: wd.target.y,
        }
        wd.noenergy();
        let x = (wd.target.x - wd.me.x) * 2
        let y = (wd.target.y - wd.me.y) * 2
        wd.go(x + wd.me.x, y + wd.me.y);
        wd.damage();

    }
}


//разбрасывает бомбы, а потом одинм ходом взрывает, лучше чем бить с руки так как площадь, но если взрывать по одной, то не лучше

//залепляет по цепочке, никто не может отойти пока не прервет цепочку или не отпнет прилипалу

//пинатель
// Трибот делится на троих
// Дерижабль
// бык толкатель
// морф, превращается в любого до конца хода
// бесполщадная мозгососка
//некромант
// Птица ужастень
// Копатель выкопатель яма
// нидус-червь
// Осадный танк тратит ход для осадного положения и не стреляет в упор. Убивает.
// Огнемётчик вместо заразителя
// поджигает землю, юнитов, погибшние юнниты оставляют огонек
// феникс
// вечный стазис???
// Бессмертие - жизнь в ход
// вампир?
// Телепат
// Штамповщик
// берсерк, умирает если не атакует

// Зомби(зомбиапокалипсис)ча