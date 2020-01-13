const input = require('./input');
const test = require('./test');

exports.main = (io) =>{
    test();
    input.tick();
    input.socket(io);
    input.bot();
};
