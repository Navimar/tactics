const en = require('./engine');


exports.telepath = (game) => {
	game.unit.forEach((u) => {
		u.status.remove('telepath')
	});
}
exports.frog = (game) => {
	game.unit.forEach((u) => {
    u.status.remove('frog')
		if (u.tp == 'frog')
			u.data.lastjump = false;
	});
}