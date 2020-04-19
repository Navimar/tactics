const en = require('./engine');


exports.telepath = (game) => {
	game.unit.forEach((u) => {
		u.status.remove('telepath')
	});
}
exports.worm = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'worm' && game.spoil[i].team == game.turn) {
			en.death(game, en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y));
			en.move(game, game.spoil[i].data.unit, game.spoil[i].x, game.spoil[i].y);
			game.spoil.splice(i, 1)
		}
	}
}
exports.frog = (game) => {
	game.unit.forEach((u) => {
		u.status.remove('frog')
		if (u.tp == 'frog')
			u.data.lastjump = false;
	});
}