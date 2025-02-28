import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import run from "./server/run.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "img")));
app.use(express.static(path.join(__dirname, "img.nosync")));
app.use(express.static(path.join(__dirname, "sound")));

app.get("*", (req, res) => {
  res.status(404).send("nothing there");
});

const port = process.env.PORT || 3000;
const ip = process.env.IP || "127.0.0.1";

run(io);

httpServer.listen(port, ip, () => {
  console.log(`Listening on ${ip}:${port}`);
});
