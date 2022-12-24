const Telegraf = require('telegraf');

const config = require('../config/config.js');

const bot = new Telegraf(config.botkey);

bot.launch();

module.exports = bot;