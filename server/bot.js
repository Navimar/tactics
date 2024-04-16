const Telegraf = require("telegraf");

const dotenv = require("dotenv");

dotenv.config();

const bot = new Telegraf(process.env.BOTKEY);

bot.launch();

module.exports = bot;
