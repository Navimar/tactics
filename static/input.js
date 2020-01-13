const socket = io();
function inputServer() {
    socket.on('connect', function () {
      console.log('connected');
    //   socket.emit('login', login);
    });
    socket.on('update', function (val) {
      onUpdate(val);
    });
    socket.on('login', (val) => {
      onLogin(val);
    });
  }