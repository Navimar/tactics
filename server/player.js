
const sha = require("sha256");
const player = [];

exports.register = (id) => {
    let p = { id, socket: false, key: false }
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
