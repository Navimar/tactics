import Telegraf from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOTKEY);

bot.launch();

export default bot;
