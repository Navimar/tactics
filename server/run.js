const input = require('./input');
const test = require('./test');
const meta = require('./meta');

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
  
  let i = 0;
  let arr = []
  Object.keys(meta).forEach(function (key) {
    arr.push({
      name: key, rank: meta[key].rank
    });
  });
  arr = arr.sort((a, b) => { return a.rank - b.rank })
  arr.forEach((e) => {
    if (meta[e.name].weight > 0) {
      i++
      console.log(i, e.name, e.rank)
    }
  });

  input.tick();
  input.socket(io);
  input.bot();
};
