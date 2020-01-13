
const TelegramBot = require('telebot');
// const Telegraf = require('telegraf');
const config = require('./config');

const bot = new TelegramBot(config.botkey);
// const bot = new Telegraf(config.botkey);
bot.connect();
// bot.start((ctx) => ctx.reply('Welcome')); 
// bot.launch();

module.exports = bot;