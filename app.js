var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var run = require('./server/run.js');
let config = require('./server/config.js');


app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/script'));
app.use(express.static(__dirname + '/img'));

app.get('*', function (req, res) {
    res.status(404).send("nothing there");
});

// app.get('/log', function (req, res) {
//     const text = fs.readFileSync(process.env.OPENSHIFT_LOG_DIR + 'nodejs.log', 'utf8');
//     res.status(200).send(text);
// });

const port = config.port;
const ip = config.ip;

run.main(io, ip, port);

http.listen(port, ip, function () {
    console.log('listening on ' + ip +":"+port);
});

