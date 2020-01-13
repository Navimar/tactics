let en = {};
en.near = (x, y) => {


    return [{ x: x - 1, y }, { x: x + 1, y }, { x, y: y - 1 }, { x, y: y + 1 }].filter(pt => pt.x <= 8 && pt.x >= 0 && pt.y >= 0 && pt.y <= 8)
}

en.isOccupied = (game, x, y) => {
    return game.data.unit.filter(u => u.x == x && u.y == y).length;
}
en.unitInPoint = (game, x, y) => {
    return game.data.unit.filter(u => u.x == x && u.y == y)[0];
}

en.death = (game, unit) => {
    game.data.unit.splice(game.data.unit.indexOf(unit), 1);
}

en.damage = (game, unit) => {
    unit.life--;
    if (unit.life <= 0) en.death(game, unit);
}

en.move = (unit, x, y) => {
    unit.x = x
    unit.y = y
}

module.exports = en;