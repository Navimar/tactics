const socket = io();
function inputServer() {
    socket.on('connect', function () {
        console.log('connected');
        //   socket.emit('login', login);
    });
    socket.on('disconnect', function () {
        // alert('disconnected');
        tip('Разорвано соединение с сервером...', 3, 3, '#F00', 5, '2vmax verdana');
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