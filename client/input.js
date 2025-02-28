import { io } from "socket.io-client";
import { onLogin, onUpdate } from "./logic.js";
import { render } from "./render.js";

export const socket = io();
export function inputServer() {
  socket.on("connect", function () {
    console.log("connected");
  });
  socket.on("disconnect", function () {
    render();
  });
  socket.on("update", function (val) {
    val.data.history = val.history;
    onUpdate(val.data);
  });
  socket.on("login", (val) => {
    onLogin(val);
  });
  socket.on("logic", (val) => {
    alert(val);
  });
}
