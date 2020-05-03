const fs = require('fs');
const sha = require("sha256");
const config = require('./config');

const playerArr = [];

let player = {}
player.register = (id) => {
    let p = { id, rank: 0, socket: false, key: false }
    fs.readFile('data/' + p.id, 'utf8', function (err, data) {
        if (data) {
            p.rank = parseInt(data);
        }
    });
    playerArr.push(p);
    return p;
}
player.byId = (id) => {
    for (let p of playerArr) {
        if (p.id == id) {
            return p;
        }
    }
    return false;
}

player.wins = (winner, loser) => {
    winner.rank = Math.ceil(winner.rank + loser.rank * 3 / 100 * (1 - winner.rank / 100000) + 10)
    loser.rank = Math.floor(loser.rank * 97 / 100);
    fs.writeFile('data/' + winner.id, winner.rank, function (err) {
        if (err) throw err;
    });
    fs.writeFile('data/' + loser.id, loser.rank, function (err) {
        if (err) throw err;
    });
}

player.bySocket = (socket) => {
    for (let p of playerArr) {
        if (p.socket == socket) {
            return p;
        }
    }
    return false
}

player.setSocket = (id, socket) => {
    for (let p of playerArr) {
        if (p.id == id) {
            p.socket = socket;
            return p;
        }
    }
    playerArr.push({ id, socket });
}

player.setKey = (p) => {
    const token = GenerateToken();
    p.key = sha(token);
    return token;
};
player.link = (p, game) => {
    return (config.ip + ":" + config.port + "/?id=" + p.id + "&key=" + player.setKey(p) + 'u')
}

function GenerateToken(stringLength) {
    // set the length of the string
    if (stringLength == undefined) {
        stringLength = 35;
    }
    // list containing characters for the random string
    let stringArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '?'];


    let rndString = "";

    // build a string with random characters
    for (let i = 1; i < stringLength; i++) {
        let rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
        rndString = rndString + stringArray[rndNum];
    }
    return rndString;
}
module.exports = player;