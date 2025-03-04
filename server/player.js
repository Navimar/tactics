import fs from "fs";
import sha from "sha256";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const playerArr = [];

let player = {};

player.register = (id) => {
  const filePath = path.join("data", String(id));
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let p = {
    id,
    rank: 0,
    socket: new Map(),
    key: false,
    game: [],
    lastsocket: 0,
    subscribe: true,
  };

  fs.readFile(filePath, "utf8", function (err, data) {
    try {
      const jsonData = JSON.parse(data);
      p.rank = jsonData.rank || 0;
      p.subscribe = jsonData.subscribe === undefined ? true : jsonData.subscribe;
      p.username = jsonData.username;
    } catch (parseErr) {
      fs.writeFile(
        filePath,
        JSON.stringify({ rank: p.rank, subscribe: p.subscribe, username: p.username }),
        (err) => {
          if (err) console.error(err);
        }
      );
    }
  });

  playerArr.push(p);
  return p;
};

player.setUsername = (thePlayer, username) => {
  thePlayer.username = username;
  player.updateFile(thePlayer);
};

player.updateFile = (thePlayer) => {
  let data = {
    id: thePlayer.id,
    rank: thePlayer.rank,
    username: thePlayer.username,
    subscribe: thePlayer.subscribe,
  };
  fs.writeFile("data/" + thePlayer.id, JSON.stringify(data), (err) => {
    err;
  });
};

player.byId = (id) => {
  for (let p of playerArr) {
    if (p.id == id) {
      return p;
    }
  }
  return false;
};
player.number = (gm, p) => {
  let n = 1;
  if (gm.players[0].id != p.id) n = 2;
  return n;
};

player.list = () => {
  return playerArr;
};

player.stop = (p) => {
  p.subscribe = !p.subscribe;
  player.updateFile(p);
  return p.subscribe;
};

player.addSocket = (p, gameid, socket) => {
  p.socket.set(gameid, socket);
};

player.wins = (winner, loser) => {
  let max_rank = 100000;
  let percent = 1;
  winner.rank = Math.ceil(
    winner.rank + ((loser.rank * percent) / 100) * (1 - winner.rank / max_rank) + 1
  );
  loser.rank = Math.floor((loser.rank * (100 - percent)) / 100);
  try {
    player.updateFile(winner);
    player.updateFile(loser);
  } catch (err) {
    console.error(err);
  }
};

player.bySocket = (socket, gameid) => {
  for (let p of playerArr) {
    if (p.socket.get(gameid) == socket) return p;
  }
  return false;
};

player.setSocket = (id, socket) => {
  for (let p of playerArr) {
    if (p.id == id) {
      p.socket = socket;
      return p;
    }
  }
  playerArr.push({ id, socket });
};

player.setKey = (p) => {
  const token = GenerateToken();
  p.key = sha(token);
  return token;
};
// player.link = (p, game) => {
//   return process.env.DOMAIN + "/?id=" + p.id + "&key=" + player.setKey(p) + "u";
// };

player.clear = (p, gameid) => {
  for (g in p.game) {
    if (p.game[g].id == gameid) p.game.splice(g, 1);
  }
};

function GenerateToken(stringLength) {
  // set the length of the string
  if (stringLength == undefined) {
    stringLength = 35;
  }
  // list containing characters for the random string
  let stringArray = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "!",
    "?",
  ];

  let rndString = "";

  // build a string with random characters
  for (let i = 1; i < stringLength; i++) {
    let rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
    rndString = rndString + stringArray[rndNum];
  }
  return rndString;
}
export default player;
