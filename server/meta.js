const en = require('./engine');

exports.warrior = {
    life: 3,
    img: 'bear',
    akt: (akt) => {
        // return [{ x: 5, y: 5, img: 'move' }]
        return akt.move().concat(akt.hand())
    },
    move: (wd) => {
        wd.walk();
    },
    warrior: (wd) => {
        wd.damage();
        wd.tire();
        // wd.moveTo(target, wd.me.pt, 2);
    }
}

exports.bear = {
    life: 3,
    img: 'bear',
    akt: (akt) => {
        let akts = akt.move()
        let points = en.near(akt.me.x, akt.me.y);
        points = points.filter(pt => {
            let x = (2*akt.me.x - pt.x)
            let y = (2*akt.me.y - pt.y)
            return en.isOccupied(akt.game, pt.x, pt.y) && !en.isOccupied(akt.game, x, y)
        });
        points.forEach((pt) => {
            akts.push({
                x: pt.x,
                y: pt.y,
                img: 'bear',
            })
        });
        // return [{ x: 5, y: 5, img: 'move' }]
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

//разбрасывает бомбы, а потом одинм ходом взрывает, лучше чем бить с руки так как площадь, но если взрывать по одной, то не лучше


//залепляет по цепочке, никто не может отойти пока не прервет цепочку или не отпнет прилипалу