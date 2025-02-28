let clock = 0;

const exports = {};
exports.tick = () => {
  clock++;
};
exports.clock = () => {
  return clock;
};
export default exports;
