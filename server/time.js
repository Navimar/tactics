let clock = 0;

exports.tick = () => {
    clock++
}
exports.clock = () => {
    return clock
}