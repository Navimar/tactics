
// const TelegramBot = require('telebot');
const Telegraf = require('telegraf');
const config = require('../config/config.js');

// const bot = new TelegramBot(config.botkey);
const bot = new Telegraf(config.botkey);
// bot.connect();
bot.launch();

module.exports = bot;