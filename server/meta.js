const akt = require('./akt');

exports.bear = {
    life: 3,
    img: 'bear',
    akt: (akt) => {
        // return [{ x: 5, y: 5, img: 'move' }]
        return akt.move().concat(akt.hand())
    },
    move: (wd, target) => {
        wd.walk(target);
    },
    bear: (wd, target) => {
        wd.damage(target);
        wd.tire();
        // wd.moveTo(target, wd.me.pt, 2);
    }
}

//разбрасывает бомбы, а потом одинм ходом взрывает, лучше чем бить с руки так как площадь, но если взрывать по одной, то не лучше


//залепляет по цепочке, никто не может отойти пока не прервет цепочку или не отпнет прилипалу