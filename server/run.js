import input from "./input.js";

export default (io) => {
  Array.prototype.remove = function () {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  input.start();
  input.tick();
  input.socket(io);
  input.bot();
};
