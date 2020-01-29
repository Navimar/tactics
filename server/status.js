exports.telepath = {
    onEndturn: (wd) => {
        wd.me.status = false;
    },
    onAkt: (akt, akts) => {
        akts = akts.filter(e => {
            if (e.img == 'telepath' && e.x == akt.me.x && e.y == akt.me.y) {
                return false;
            } else {
                return true;
            }
        });
        return akts;
    }
}
