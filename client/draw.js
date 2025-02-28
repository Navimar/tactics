import { getDeviceType } from "./util.js";
import { system, local } from "./data.js";
import { canvasText } from "./canvas.js";
import { data } from "./data.js";

const grafio = initGrafio();

//load
const canvasStatic = document.getElementById("canvas");
const ctxStatic = canvasStatic.getContext("2d");
const canvasAnimated = document.getElementById("canvasanimated");
const ctxAnimated = canvasAnimated.getContext("2d");
const ctxText = canvasText.getContext("2d");

const questionmark = new Image();
questionmark.src = "/undefined.png";

function resizecanvas(canvas, ctx) {
  const realWidth = window.innerWidth * window.devicePixelRatio;
  const realHeight = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  if (getDeviceType() == "desktop") {
    canvas.width = realWidth;
    canvas.height = realHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  let cellWidth = 14;
  if (canvas.width > canvas.height) {
    if (canvas.height / 9.3 < canvas.width / cellWidth) system.dh = canvas.height / 9.3;
    else system.dh = canvas.width / cellWidth;
    system.orientation = "w";
  } else {
    if (canvas.height / cellWidth < canvas.width / 9) system.dh = canvas.height / cellWidth;
    else system.dh = canvas.width / 9;
    system.orientation = "h";
  }
  if (system.orientation == "w") {
    system.shiftX = (canvas.width - system.dh * 8) / 2;
    system.shiftY = (canvas.height - system.dh * 9) / 2;
  }
  if (system.orientation == "h") {
    system.shiftX = (canvas.width - system.dh * 9) / 2;
    system.shiftY = (canvas.height - system.dh * 8) / 2;
  }

  system.dh = Math.ceil(system.dh);
}

function determineColor(team, isReady, isActive) {
  let color = false;
  if (!data.chooseteam && data.bonus == "ready") {
    if (team == 2 && isReady) color = "team2Ready";
    if (team == 2 && !isReady) color = "team2NotReady";
    if (team == 1 && isReady && data.turn) color = "team1Ready";
    if (team == 1 && isReady && !data.turn) color = "team1NotReady";
    if (team == 1 && !isReady) color = "team1NotReady";
  } else {
    if (team == 1 && isReady) color = "team1choose";
    if (team == 2 && isReady) color = "team2choose";
  }
  if (isActive && team == 1) color = "team1active";
  if (team == 3) color = "team3";
  return color;
}

export default {
  resize: (active) => {
    if (active) resizecanvas(canvasAnimated, ctxAnimated);
    else {
      resizecanvas(canvasStatic, ctxStatic);
      resizecanvas(canvasText, ctxText);
    }
  },

  drawBackground: (name) => {
    let s = system.dh;
    let img = getImgRaw(name + ".bck", s);
    for (var tileX = 0; tileX < canvas.width; tileX += system.dh) {
      for (var tileY = 0; tileY < canvas.height; tileY += system.dh) {
        drawImageCeil(img, tileX, tileY, system.dh, system.dh);
      }
    }
  },
  drawBoard: () => {
    ctx.save();
    for (x = shiftX; x <= canvas.width; x += system.dh) {
      for (y = shiftY; y <= canvas.height; y += system.dh) {
        ctx.strokeStyle = "rgba(200,200,200,0.1)";
        // ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.globalAlpha = 0.2;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  drawTxt: (txt, x, y, width, color, size, font, animate) => {
    let ctx = ctxText;
    color = color || "#222";
    size = size || 100;
    width = width || 0;
    size = system.dh * 0.26 * size * 0.01;
    font = font || "Play";
    font = size + "px " + font;
    ctx.font = font;
    ctx.fillStyle = "white";
    ctx.textBaseline = "top";

    function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
      marginLeft = marginLeft + 0.1 * system.dh;
      let lines = 1;
      let originalmarginttop = marginTop;
      let calculatedmarginTop = marginTop;
      function dt(line) {
        ctx.fillStyle = color;
        for (let blx = 1; blx <= 3; blx++) {
          for (let bly = 1; bly <= 3; bly++) {
            context.fillText(line, marginLeft + blx, marginTop + bly);
            context.fillText(line, marginLeft - blx, marginTop - bly);
            context.fillText(line, marginLeft + blx, marginTop - bly);
            context.fillText(line, marginLeft - blx, marginTop + bly);
          }
        }
        ctx.font = font;
        lineHeight = size * 1.1;
        ctx.fillStyle = "white";
        context.fillText(line, marginLeft, marginTop);
      }

      let doit = () => {
        let words = text.split(" ");
        let countWords = words.length;
        let line = "";
        for (let n = 0; n < countWords; n++) {
          let testLine = line + words[n] + " ";
          let testWidth = context.measureText(testLine).width;
          if (testWidth > maxWidth - 0.1 * system.dh || words[n] === "\n") {
            dt(line);
            if (words[n] === "\n") {
              line = words[n].slice(1);
            } else {
              line = words[n] + " ";
            }
            marginTop += lineHeight;
            lines++;
          } else {
            line = testLine;
          }
          dt(line);
        }
      };

      doit();

      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "black";
      ctx.fillRect(
        x * system.dh + system.shiftX,
        y * system.dh + system.shiftY,
        maxWidth,
        lineHeight * lines * 1.1
      );
      ctx.globalAlpha = 1.0;

      calculatedmarginTop = marginTop;
      marginTop = originalmarginttop;
      doit();

      return (calculatedmarginTop - system.shiftY + lineHeight) / system.dh;
    }

    return wrapText(
      ctx,
      txt,
      x * system.dh + system.shiftX,
      y * system.dh + system.shiftY,
      system.dh * width,
      25
    );
  },
  drawShadow: (df, color) => {
    let ctx = ctxAnimated;
    let ss = 3;
    ctx.shadowColor = color;
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowOffsetX = ss;
    ctx.shadowOffsetY = ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = -ss;
    ctx.shadowOffsetY = -ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = -ss;
    ctx.shadowOffsetY = ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = ss;
    ctx.shadowOffsetY = -ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = -ss;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = ss;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    df();
    ctx.shadowOffsetX = -ss;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    df();
  },

  drawImg: (name, x, y, animate) => {
    let p = system.dh / 10;
    let s = system.dh + 2 * p;
    let img = getImg(name, s);
    drawImageCeil(
      img,
      x * system.dh - p + system.shiftX,
      y * system.dh - p + system.shiftY,
      s,
      s,
      animate
    );
  },
  drawImgMask: (name, x, y, mask, animate) => {
    let img;
    mask = false;
    if (mask && mask.length > 0) img = getImg(name, system.dh, mask[0]);
    else img = getImg(name, system.dh);
    drawImageCeil(
      img,
      x * system.dh + system.shiftX,
      y * system.dh + system.shiftY,
      system.dh,
      system.dh,
      animate
    );
  },

  drawImgMaskAplha: (name, x, y, mask, alpha) => {
    let ctx = ctxAnimated;
    let img;
    mask = false;
    if (mask && mask.length > 0) img = getImg(name, system.dh, mask[0]);
    ctx.globalAlpha = alpha;
    drawImageCeil(
      img,
      x * system.dh + shiftX,
      y * system.dh + shiftY,
      system.dh,
      system.dh,
      animate
    );
    ctx.restore;
  },

  drawImgFieldConnection: (name, x, y, mask, animate) => {
    let img;
    mask = false;
    if (mask && mask.length > 0) img = getImg(name, system.dh, mask[0]);
    else img = getImg(name, system.dh);
    if (img && img != questionmark)
      drawImageCeil(
        img,
        x * system.dh + system.shiftX,
        y * system.dh + system.shiftY,
        system.dh,
        system.dh,
        animate
      );
  },

  drawSpoil: (name, x, y, animate) => {
    let ctx = animate ? ctxAnimated : ctxStatic;
    let img = getImg(name + ".spoil", system.dh);
    if (animate) {
      let cadr = local.cadrProgress + local.spoilmask[x][y];
      if (cadr > 1000) cadr -= 1000;
      if (local.cadrProgress > 500) {
        ctx.save();
        ctx.scale(-1, 1);
        drawImageCeil(
          img,
          (x * system.dh + system.shiftX) * -1 - system.dh,
          y * system.dh + system.shiftY,
          system.dh,
          system.dh,
          true
        );
        ctx.restore();
      } else
        drawImageCeil(
          img,
          x * system.dh + system.shiftX,
          y * system.dh + system.shiftY,
          system.dh,
          system.dh,
          true
        );
    } else
      drawImageCeil(
        img,
        x * system.dh + system.shiftX,
        y * system.dh + system.shiftY,
        system.dh,
        system.dh,
        false
      );
  },

  drawStatus: (name, x, y, animate) => {
    let p = system.dh / 10;
    let s = system.dh + 2 * p;
    let img = getImg(name + ".stt", s);
    drawImageCeil(
      img,
      x * system.dh - p + system.shiftX,
      y * system.dh - p * 2 + system.shiftY,
      s,
      s,
      animate
    );
  },

  drawField: (name, x, y, mask) => {
    let p = system.dh / 15;
    let h = Math.ceil(system.dh + 2 * p);
    let w = Math.ceil(img.width * (h / img.height));
    let img = getImg(name, h, mask[0]);
    if (mask[1] > 0.5) {
      ctx.save();
      ctx.scale(-1, 1);
      drawImageCeil(
        img,
        (x * system.dh - p + system.shiftX) * -1 - w,
        y * system.dh - p + system.shiftY,
        w,
        h
      );
      ctx.restore();
    } else {
      drawImageCeil(img, x * system.dh - p + system.shiftX, y * system.dh - p + shiftY, w, h);
    }
  },

  drawTrail: (name, x, y) => {
    let img = getImg(name + ".trl", system.dh);
    drawImageCeil(img, x * system.dh + shiftX, y * system.dh + shiftY, system.dh, system.dh, false);
  },

  drawAkt: (name, x, y, ws, hs, style) => {
    let ctx = ctxAnimated;
    let img = getImg(name + ".akt", system.dh);
    if (style == "enemy") {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.shadowColor = "rgba(255,0,0,1)";
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.shadowBlur = 0;
    }
    if (style == "disabled") {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.shadowColor = "rgba(0,255,0,1)";
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.shadowBlur = 0;
    }
    let px = 0;
    let py = 0;
    if (ws && hs) {
      px = (system.dh / 1000) * ws;
      py = (system.dh / 1000) * hs;
    }
    // console.log(px, py);

    let w = system.dh + 2 * px;
    let h = system.dh + 2 * py;
    drawImageCeil(
      img,
      x * system.dh - px + system.shiftX,
      y * system.dh - py * 2 + system.shiftY,
      w,
      h,
      true
    );

    ctx.restore();

    // drawImageCeil(img, x * system.dh - px + shiftX, y * system.dh - 0.1 * system.dh - py * 2 + shiftY, w, h, animate);
  },

  drawLife: (quantity, x, y) => {
    let p = system.dh / 10;

    // let img = getImg('life' + quantity, x, y);
    // ctx.drawImage(img, x * system.dh - p + shiftX, y * system.dh - p, system.dh / 3 + 2 * p, system.dh / 3 + 2 * p);
    drawTxt(quantity + "", x, y, "#328094", "2.3vmin monospace");
    // ctx.drawImage(img, x * system.dh - p*0.5  + shiftX, y * system.dh- p*0.5, system.dh/4 + 2 * p, system.dh/4 + 2 * p);
    // ctx.drawImage(img, x * system.dh  + shiftX, y * system.dh, system.dh/8 + 2 * p, system.dh/8 + 2 * p);
  },

  drawSticker: (name, x, y, team, animate) => {
    let color = false;
    if (team == 1) color = "team1Ready";
    if (team == 2) color = "team2Ready";
    if (team == 3) color = "team3";

    let size = system.dh * 0.6;
    let img = getImg(name + ".unit" + "." + color, size);

    x = x + 0.2;
    y = y + 0.4;
    drawImageCeil(
      img,
      x * system.dh + system.shiftX,
      y * system.dh + system.shiftY,
      size,
      size,
      animate
    );
  },

  drawPropUnit: (name, x, y, m, team, isReady, isActive, ws, hs, animate) => {
    let ctx = animate ? ctxAnimated : ctxStatic;
    let color = determineColor(team, isReady, isActive); // Смотрите определение функции ниже

    let px = 0;
    let py = 0;
    if (ws && hs) {
      px = (system.dh / 1000) * ws;
      py = (system.dh / 1000) * hs;
    }

    let w = system.dh + 2 * px;
    let h = system.dh + 2 * py;

    let img;
    if (!animate) img = getImg(name + ".unit" + "." + color, h);
    else img = getImg(name + ".unit" + "." + color, (h + w) / 2);

    let newYOffset = y * system.dh - 0.1 * system.dh - py * 2 + system.shiftY;

    if (m === "upsidedown") {
      ctx.save();
      ctx.translate(x * system.dh + system.shiftX, newYOffset + h); // Перемещаем начало координат для удобного переворачивания
      ctx.scale(1, -1); // Отражение по вертикали
      drawImageCeil(img, -px, -h, w, h, animate);
      ctx.restore();
    } else if (m === true) {
      ctx.save();
      ctx.scale(-1, 1); // Отражение по горизонтали
      drawImageCeil(img, (x * system.dh - px + system.shiftX) * -1 - w, newYOffset, w, h, animate);
      ctx.restore();
    } else {
      drawImageCeil(img, x * system.dh - px + system.shiftX, newYOffset, w, h, animate);
    }
  },

  drawPropUnitCropped: (name, x, y, m, team, isReady, isActive, ws, hs, animate, cropPercent) => {
    let ctx = animate ? ctxAnimated : ctxStatic;
    let color = determineColor(team, isReady, isActive); // Смотрите определение функции ниже

    let px = 0;
    let py = 0;
    if (ws && hs) {
      px = (system.dh / 1000) * ws;
      py = (system.dh / 1000) * hs;
    }

    let w = system.dh + 2 * px;
    let h = system.dh + 2 * py;
    let cropStartY = (h * cropPercent) / 100;
    let croppedH = h - cropStartY;

    let img;
    if (!animate) img = getImg(name + ".unit" + "." + color, h);
    else img = getImg(name + ".unit" + "." + color, (h + w) / 2);
    let newYOffset;

    if (cropPercent < 0) {
      newYOffset = y * system.dh - 0.1 * system.dh - py * 2 + system.shiftY - cropStartY;
    } else newYOffset = y * system.dh - 0.1 * system.dh - py * 2 + system.shiftY;

    if (m) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        0,
        -cropStartY,
        w,
        croppedH,
        (x * system.dh - px + system.shiftX) * -1 - w,
        newYOffset,
        w,
        croppedH
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        img,
        0,
        -cropStartY,
        w,
        croppedH,
        x * system.dh - px + system.shiftX,
        newYOffset,
        w,
        croppedH
      );
    }
  },

  drawProp: (name, x, y, ws, hs, animate) => {
    let px = 0;
    let py = 0;
    if (ws && hs) {
      px = (system.dh / 1000) * ws;
      py = (system.dh / 1000) * hs;
    }

    let w = system.dh + 2 * px;
    let h = system.dh + 2 * py;
    let img;
    if (!animate) img = getImg(name, h);
    else img = getImg(name, (h + w) / 2);
    drawImageCeil(
      img,
      x * system.dh - px + system.shiftX,
      y * system.dh - 0.1 * system.dh - py * 2 + system.shiftY,
      w,
      h,
      animate
    );
  },

  drawSize: (name, x, y, w, h, animate) => {
    img = getImg(name, w * system.dh);
    // ctx.drawImage(img, 0, 0, img.width, img.height/2 ,x * system.dh + shiftX, y * system.dh + shiftY, system.dh*2 , system.dh );
    drawImageCeil(
      img,
      x * system.dh + system.shiftX,
      y * system.dh + system.shiftY,
      system.dh * w,
      system.dh * h,
      animate
    );
  },
  drawPanel: (name, x, y, w, h) => {
    let img = getImgRaw(name + ".pnl");
    drawImageCeil(
      img,
      x * system.dh + system.shiftX,
      y * system.dh + system.shiftY,
      system.dh * w,
      system.dh * h,
      false
    );
  },

  message: (string) => {
    $("#console").prepend("<br><br>");
    $("#console").prepend(string);

    var txt = $("#console").html().substring(0, 600);
    $("#console").html(txt);
  },
};

function initGrafio() {
  let imgs = new Map();
  return (url) => {
    let img = imgs.get(url);

    if (img) {
      return img.complete && img.naturalWidth !== 0 ? img : null;
    } else {
      img = new Image();
      // img.onload = () => {
      //   render();
      // };
      img.src = url + ".png";
      img.onerror = function () {
        console.log("Error: Image not found: ");
        console.log(url);
      };
      imgs.set(url, img);
      return null;
    }
  };
}

function getImg(name, s, mask) {
  s = Math.ceil(s);
  let img = grafio(name + "." + s);

  if (img === undefined || img === null) {
    // img = grafio(name + ".raw");
  }

  if (img === undefined || img === null) {
    img = questionmark;
    // drawTxt(name, 0, 0, "#897f0e");
  }
  if (mask != undefined) {
    let arr = [img];
    let i = 1;
    do {
      img = grafio(name + i);
      if (img !== undefined && img !== null) {
        arr.push(img);
      }
      i++;
    } while (img !== undefined && img !== null);
    // console.log(arr, mask)
    return arr[Math.floor(mask * arr.length)];
  } else {
    return img;
  }
}
function drawImageCeil(img, x, y, w, h, animate) {
  // console.log(img);
  let ctx = animate ? ctxAnimated : ctxStatic;
  if (!animate) ctx.drawImage(img, Math.ceil(x), Math.ceil(y), Math.ceil(w), Math.ceil(h));
  else ctx.drawImage(img, x, y, w, h);
}

function getImgRaw(name) {
  let img = grafio(name + ".raw");
  if (img === undefined || img === null) img = questionmark;
  return img;
}
