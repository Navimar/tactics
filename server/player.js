const fs = require('fs');
const sha = require("sha256");
const player = [];

exports.register = (id) => {
    let p = { id, rank: 1000, socket: false, key: false }
    fs.readFile('data/' + p.id, 'utf8', function (err, data) {
        if (data) {
            p.rank = parseInt(data);
        }
    });
    player.push(p);
    return p;
}
exports.byId = (id) => {
    for (let p of player) {
        if (p.id == id) {
            return p;
        }
    }
    return false;
}

exports.wins = (winner, loser) => {
    winner.rank = Math.ceil(winner.rank + loser.rank * 3/100 * (1 - winner.rank / 100000) + 1)
    loser.rank = Math.floor(loser.rank * 97/100);
    fs.writeFile('data/' + winner.id, winner.rank, function (err) {
        if (err) throw err;
    });
    fs.writeFile('data/' + loser.id, loser.rank, function (err) {
        if (err) throw err;
    });
}

exports.bySocket = (socket) => {
    for (let p of player) {
        if (p.socket == socket) {
            return p;
        }
    }
    return false
}

exports.setSocket = (id, socket) => {
    for (let p of player) {
        if (p.id == id) {
            p.socket = socket;
            return p;
        }
    }
    player.push({ id, socket });
}

exports.setKey = (p) => {
    const token = GenerateToken();
    p.key = sha(token);
    return token;
};

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
