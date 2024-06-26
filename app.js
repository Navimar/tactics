var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var run = require("./server/run.js");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/script"));
app.use(express.static(__dirname + "/img.nosync"));
app.use(express.static(__dirname + "/img"));
app.use(express.static(__dirname + "/sound"));
app.use(express.static(__dirname + "/config"));

app.get("*", function (req, res) {
  res.status(404).send("nothing there");
});

// app.get('/log', function (req, res) {
//     const text = fs.readFileSync(process.env.OPENSHIFT_LOG_DIR + 'nodejs.log', 'utf8');
//     res.status(200).send(text);
// });

const port = process.env.PORT;
const ip = process.env.IP;

run.main(io, ip, port);

http.listen(port, ip, function () {
  console.log("listening on " + ip + ":" + port);
});
