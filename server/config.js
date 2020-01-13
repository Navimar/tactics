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
    ip: "46.101.23.21",
    port: "80",
    botkey: '',
    speed: 1,
  }
}