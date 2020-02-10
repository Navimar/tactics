const socket = io();
function inputServer() {
    socket.on('connection', function () {
        console.log('connected');
    });
    socket.on('disconnect', function () {
        render()
    });
    socket.on('update', function (val) {
        onUpdate(val);
    });
    socket.on('login', (val) => {
        onLogin(val);
    });
    socket.on('logic', (val) => {
        alert(val);
    });
}