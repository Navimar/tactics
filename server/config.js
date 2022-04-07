const os = require('os');

if (os.platform() == 'darwin' || os.platform() == 'win32') {
  module.exports = {
    ip: "127.0.0.1",
    port: "3000",
    botkey: '993997996:AAEf5EpHS-V5VX_sYpc5iZE62wZsq4UW_TE',
    speed: 1,
  }
} else {
  module.exports = {
    ip: "167.99.138.89",
    port: "8000",
    botkey: '1000504506:AAGsQTgD-paoUrMwoldGeQMwWdmjN3pcbJ4',
    speed: 1,
  }
}