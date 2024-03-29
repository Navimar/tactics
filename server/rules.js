const en = require('./engine');
const _ = require('lodash');
const meta = require('./meta');
const gm = require('./game');
const wrapper = require('./wrapper');

// exports.dead = (game) => {
// 	while (game.deadPool.length > 0) {
// 		for (let i = game.deadPool.length; i--; i > 0) {
// 			if (_.isFunction(meta[game.deadPool[i].tp].onDeath)) {
// 				meta[game.deadPool[i].tp].onDeath(wrapper(game, game.deadPool[i], { x: game.deadPool[i].x, y: game.deadPool[i].y, unit: game.deadPool[i] }));
// 			}
// 			game.deadPool.splice(i, 1)
// 		}
// 	}
// }
exports.telepath = (game) => {
	game.unit.forEach((u) => {
		u.status.remove('telepath')
	});
}

exports.firestt = (game) => {
	game.unit.forEach((u) => {
		if (u.status.includes('fire2')) {
			if (game.field[u.x][u.y] != 'water') {
				en.death(game, u);
				en.addSpoil(game, 'fire', u.x, u.y, false, 3);
			} else
				u.status.remove('fire2')
		}
		if (u.status.includes('fire')) {
			u.status.remove('fire')
			if (game.field[u.x][u.y] != 'water')
				u.status.push('fire2')
		}
	});
}
exports.mine = (game) => {
	game.unit.forEach((u) => {
		if (u.team == game.turn && u.tp == 'mine')
			game.gold[game.turn - 1] += 3
	});
}
exports.fireend = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		let sp = game.spoil[i];
		if (sp.name == 'fire') {
			if (en.inField(sp.x, sp.y) && game.field[sp.x][sp.y] == 'water')
				game.spoil.splice(i, 1)
			else {
				let unit = en.unitInPoint(game, sp.x, sp.y)
				if (unit) {
					en.addStatus(unit, 'fire');
					game.spoil.splice(i, 1)
				}
			}
		}
	}
	game.unit.forEach((u) => {
		if (u.status.includes('fire2'))
			if (game.field[u.x][u.y] == 'water')
				u.status.remove('fire2')
		if (u.status.includes('fire'))
			if (game.field[u.x][u.y] == 'water')
				u.status.remove('fire')
	});
}

exports.worm = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'worm' && game.spoil[i].team == game.turn) {
			let unit = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
			if (en.isAlive(game, game.spoil[i].data.worm)) {
				if (game.spoil[i].data.worm != unit) {
					en.death(game, unit);
					en.addSpoil(game, 'wormportal', game.spoil[i].data.worm.x, game.spoil[i].data.worm.y, { worm: game.spoil[i].data.worm }, 3);
					en.move(game, game.spoil[i].data.worm, game.spoil[i].x, game.spoil[i].y);
				}
			}
			game.spoil.splice(i, 1)
		}
	}
}
exports.wormportal = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'wormportal' && !en.isAlive(game, game.spoil[i].data.worm))
			game.spoil.splice(i, 1)
	}
}

exports.rockettarget = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'rockettarget') {
			if (game.spoil[i].data.timer == 0) {
				let unit = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
				if (en.isAlive(game, game.spoil[i].data.unit) && game.spoil[i].data.unit.tp == 'rocket') {
					if (game.spoil[i].data.unit != unit) {
						en.death(game, unit);
						en.move(game, game.spoil[i].data.unit, game.spoil[i].x, game.spoil[i].y);
						en.death(game, game.spoil[i].data.unit);
						for (let xx = -1; xx <= 1; xx++) {
							for (let yy = -1; yy <= 1; yy++) {
								if (en.inField(game.spoil[i].x + xx, game.spoil[i].y + yy)) {
									if (game.field[game.spoil[i].x + xx][game.spoil[i].y + yy] == 'grass')
										game.field[game.spoil[i].x + xx][game.spoil[i].y + yy] = 'ground'
									en.death(game, en.unitInPoint(game, game.spoil[i].x + xx, game.spoil[i].y + yy));
									en.addSpoil(game, 'fire', game.spoil[i].x + xx, game.spoil[i].y + yy, false, 3);
								}
							}
						}
					}
				}
				game.spoil.splice(i, 1)
			} else {
				game.spoil[i].data.timer--
			}
		}
	}
}
exports.landmine = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'landmine' && game.spoil[i].team == game.turn) {
			en.addUnit(game, 'landmine', game.spoil[i].x, game.spoil[i].y, game.spoil[i].team);
			game.spoil.splice(i, 1)
		}
	}
}

exports.egg = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'egg' && !en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)) {
			// let tp
			// do {
			// 	tp = _.sample(Object.keys(meta));
			// } while (tp == game.spoil[i].data.tp)
			en.addUnit(game, game.spoil[i].data.tp, game.spoil[i].x, game.spoil[i].y, game.spoil[i].data.team);
			// en.addUnit(game, tp, game.spoil[i].x, game.spoil[i].y, game.spoil[i].data.team);
			game.spoil.splice(i, 1)
		}
	}
}

exports.eggcrack = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		let sp = game.spoil[i];
		if (sp.name == 'egg') {
			let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
			if (u) {
				game.trail.push({ img: 'egg', x: game.spoil[i].x, y: game.spoil[i].y });
				game.spoil.splice(i, 1);
			}
		}
	}
}

exports.landmineexplosion = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		let sp = game.spoil[i];
		if (sp.name == 'landmine') {
			let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
			if (u) {
				en.death(game, u);
				en.addUnit(game, 'landmine', game.spoil[i].x, game.spoil[i].y, game.spoil[i].team);
				game.spoil.splice(i, 1);
			}
		}
	}
}

exports.frog = (game) => {
	game.unit.forEach((u) => {
		// u.status.remove('frog')
		if (u.tp == 'frog')
			u.data.lastjump = false;
	});
}
exports.drillgun = (game) => {
	game.unit.forEach((u) => {
		// u.status.remove('frog')
		if (u.tp == 'drillgun')
			u.data.summoned = false;
	});
}
exports.aerostat = (game) => {
	game.unit.forEach((u) => {
		if (u.tp == 'aerostat')
			u.data.drop = false;
	});
}
exports.split = (game, unit) => {
	if (unit && unit.status.includes('spliter')) {
		unit.status.remove('spliter')
		unit.status.push('spliter2')
	}
}
exports.splitOnEndturn = (game) => {
	for (i = game.unit.length; i--; i > 0) {
		let u = game.unit[i];
		if (u.status.includes('spliter2')) {
			en.disappear(game, u);
		}
		if (u.status.includes('spliter')) {
			u.status.remove('spliter')
			u.status.push('spliter2')
		}
	}
}

exports.spill = (game) => {
	let ok = true;
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (game.field[x][y] == 'water')
				game.field[x][y] = 'ground'
		}
	}
	game.unit.forEach((unit) => {
		if (unit.tp == 'fountain') if (game.field[unit.x][unit.y] == 'ground') game.field[unit.x][unit.y] = 'water';
	});
	while (ok) {
		ok = false;
		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				if (game.field[x][y] == 'ground') {
					en.near(x, y).forEach((p) => {
						if (game.field[p.x][p.y] == 'water') {
							game.field[x][y] = 'water'
							ok = true;
						}
					});
				}
			}
		}
	}
}
exports.capture = (game) => {
	game.unit.forEach((unit) => {
		if (game.field[unit.x][unit.y] == 'team1' && unit.team == 2) game.field[unit.x][unit.y] = 'team2';
		if (game.field[unit.x][unit.y] == 'team2' && unit.team == 1) game.field[unit.x][unit.y] = 'team1';
	});
}

exports.bomber = (wd) => {
	if (wd.me.status.includes('bomber')) {
		for (let xx = -1; xx <= 1; xx++) {
			for (let yy = -1; yy <= 1; yy++) {
				if (en.inField(wd.target.x + xx, wd.target.y + yy) && wd.game.field[wd.target.x + xx][wd.target.y + yy] == 'grass')
					wd.game.field[wd.target.x + xx][wd.target.y + yy] = 'ground'
			}
		}
		wd.kill(wd.me.x - 1, wd.me.y - 1);
		wd.spoil('fire', wd.me.x - 1, wd.me.y - 1, false, 3);
		wd.kill(wd.me.x, wd.me.y - 1);
		wd.spoil('fire', wd.me.x, wd.me.y - 1, false, 3);
		wd.kill(wd.me.x + 1, wd.me.y - 1);
		wd.spoil('fire', wd.me.x + 1, wd.me.y - 1, false, 3);
		wd.kill(wd.me.x + 1, wd.me.y);
		wd.spoil('fire', wd.me.x + 1, wd.me.y, false, 3);
		wd.kill(wd.me.x - 1, wd.me.y);
		wd.spoil('fire', wd.me.x - 1, wd.me.y, false, 3);
		wd.kill(wd.me.x - 1, wd.me.y + 1);
		wd.spoil('fire', wd.me.x - 1, wd.me.y + 1, false, 3);
		wd.kill(wd.me.x, wd.me.y + 1);
		wd.spoil('fire', wd.me.x, wd.me.y + 1, false, 3);
		wd.kill(wd.me.x + 1, wd.me.y + 1)
		wd.spoil('fire', wd.me.x + 1, wd.me.y + 1, false, 3);
		wd.spoil('fire', wd.me.x, wd.me.y, false, 3);
	}
}

exports.drop = (wd) => {
	if (wd.me.sticker) {
		en.addUnit(wd.game, wd.me.sticker.tp, wd.me.x, wd.me.y, wd.me.sticker.team, 3)
	}
}

exports.slime = (game) => {
	game.unit.forEach((u) => {
		u.status.remove('slime')
		u.status.remove('openslime')
	});

	let slimes = game.unit.filter(u => u.tp == 'slime');

	slimes.forEach(slime => {
		let marks = new Map();
		marks.set(slime.x + '_' + slime.y, { x: slime.x, y: slime.y });
		let nw = true;
		while (nw) {
			nw = false;
			game.unit.forEach((u) => {
				let npt = en.near(u.x, u.y)
				npt.forEach((n) => {
					if (marks.get(n.x + '_' + n.y)) {
						if (!marks.get(u.x + '_' + u.y)) {
							marks.set(u.x + '_' + u.y, { x: u.x, y: u.y });
							nw = true;
						}
					}
				});
			});
		}
		marks.forEach((v, k, m) => {
			let u = en.unitInPoint(game, v.x, v.y)
			if (u.tp != 'slime' && slime.team != u.team)
				en.addStatus(en.unitInPoint(game, v.x, v.y), 'slime');
			else if (u.tp != 'slime' && slime.team == u.team)
				en.addStatus(en.unitInPoint(game, v.x, v.y), 'openslime');
		});
	});
}
exports.lover = (game) => {
	let lover = false;
	game.unit.forEach(u => {
		if (u.tp == 'lover')
			lover = true;
	});
	if (!lover)
		for (i = game.unit.length; i--; i > 0) {
			if (game.unit[i].status.includes('love')) {
				en.death(game, game.unit[i]);
			}
		}
}
exports.staziser = (game) => {
	let olddata;
	let staziser = 0;
	game.unit.forEach(u => {
		if (u.tp == 'staziser') {
			staziser++;
			olddata = u.data.staziser;
		}
	});
	if (staziser == 0 || (olddata && olddata > staziser))
		for (i = game.unit.length; i--; i > 0) {
			game.unit[i].status.remove('stazis')
		}
	game.unit.forEach(u => {
		if (u.tp == 'staziser')
			u.data.staziser = staziser;
	});
}

exports.drill = (game) => {
	game.unit.forEach(u => {
		if (u.tp == 'drill' && u.data.dir) {
			let tu = en.unitInPoint(game, u.x + u.data.dir.x, u.y + u.data.dir.y)
			if (tu)
				en.death(game, tu);
			en.move(game, u, u.x + u.data.dir.x, u.y + u.data.dir.y);
		}
	});

}

exports.hoplite = (game) => {
	for (i = game.spoil.length; i--; i > 0) {
		let u = en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)
		if (u && game.spoil[i].name == 'spear' && u.tp == 'hoplite') {
			// if (u.data.spear)
			game.spoil.splice(i, 1)
			u.data.spear = false;
		}
	}
}

exports.airdrop = (game) => {
	for (let i = game.spoil.length; i--; i > 0) {
		if (game.spoil[i].name == 'airdrop' && !en.unitInPoint(game, game.spoil[i].x, game.spoil[i].y)) {
			let ptt = en.near9(game.spoil[i].x, game.spoil[i].y).filter(pt => game.field[pt.x][pt.y].substring(0, 4) == 'team')
			ptt = ptt[0]
			console.log('ptt', ptt)
			console.log(game.field[ptt.x][ptt.y].substring(4));
			let team = game.field[ptt.x][ptt.y].substring(4)
			let fu = en.addUnit(game, 'flower', game.spoil[i].x, game.spoil[i].y, team);
			fu.isReady = false;
			fu.isActive = false;
			game.spoil.splice(i, 1)
		}
	}
	// let p = _.sampleSize(en.allPoints().filter(pp => !en.isOccupied(game, pp.x, pp.y)));
	let min;
	game.flowermap.forEach(f => {
		if (!min || min > f.w)
			min = f.w
	});
	let ptf = game.flowermap;

	ptf = ptf.filter(mappt => {
		if (en.isOccupied(game, mappt.x, mappt.y) || mappt.w != min)
			return false
		return true
	});

	ptf = _.sampleSize(ptf);
	// console.log("ptf", ptf);

	i = 0;
	// let ptf = game.flowermap.filter(mappt => !en.isOccupied(game, mappt.x, mappt.y))
	// let sum = 0;
	// if (ptf.length > 0) {
	// 	ptf.forEach(e => sum += e.w);
	// 	let r = _.random(sum);
	// 	i = 0;
	// 	while (r > 0) {
	// 		r -= ptf[i].w;
	// 		if (r > 0)
	// 			i++;
	// 	}
	// console.log('ptf', i, ptf[i])
	en.addSpoil(game, 'airdrop', ptf[i].x, ptf[i].y, false, 3);
	// game.flowermap.forEach(mappt => mappt.w = mappt.w + Math.round(Math.pow((Math.abs(mappt.x - ptf[i].x) + Math.abs(mappt.y - ptf[i].y)), 3) / 10))
	let fx = Math.ceil((ptf[i].x + 1) / 3)
	let fy = Math.ceil((ptf[i].y + 1) / 3)
	game.flowermap.forEach(mappt => {
		if (Math.ceil((mappt.x + 1) / 3) == fx && Math.ceil((mappt.y + 1) / 3) == fy)
			mappt.w += 1
		else
			mappt.w += 0
	});
	console.log(game.flowermap);
}

exports.flagwin = (game) => {
	let flag = [0, 0]
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (game.field[x][y] == 'team1') {
				flag[0]++
			}
			if (game.field[x][y] == 'team2') {
				flag[1]++
			}
		}
	}
	if (flag[0] == 0) {
		gm.endgame(game, 2);
	}
	else if (flag[1] == 0) {
		gm.endgame(game, 1);
	}
}