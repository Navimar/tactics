const en = require('./engine');

module.exports = (game, unit, target) => {
    return {
        game,
        unit,
        target,
        walk: () => {
            let tire = Math.abs(unit.x - target.x) + Math.abs(unit.y - target.y)
            en.move(unit, target.x, target.y);
            unit.energy -= tire;
            if (game.data.field[unit.x][unit.y] == 'team1' && unit.team == 2) game.data.field[unit.x][unit.y] = 'team2';
            if (game.data.field[unit.x][unit.y] == 'team2' && unit.team == 1) game.data.field[unit.x][unit.y] = 'team1';
        },
        damage: () => {
            en.damage(game, en.unitInPoint(game, target.x, target.y));
        },
        tire: () => {
            unit.isReady = false;
            unit.isActive = false;
        }
    }
}