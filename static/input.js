const socket = io();
function inputServer() {
    socket.on('connection', function () {
        console.log('connected');
    });
    socket.on('disconnect', function () {
        render()
    });
    socket.on('update', function (val) {
        val.data.history = val.history
        onUpdate(val.data);
});
socket.on('login', (val) => {
    onLogin(val);
});
socket.on('logic', (val) => {
    alert(val);
});
}