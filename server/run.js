const input = require('./input');
const test = require('./test');

exports.main = (io) => {

    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    test();
    input.tick();
    input.socket(io);
    input.bot();
};
