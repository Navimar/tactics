const grafio = initGrafio();

//load
const canvasStatic = document.getElementById("canvas");
const ctxStatic = canvasStatic.getContext("2d");
const canvasAnimated = document.getElementById("canvasanimated");
const ctxAnimated = canvasAnimated.getContext("2d");

const questionmark = new Image();
questionmark.src = "/undefined.png";
let dh = 0;
let shiftX = 0;
let shiftY = 0;
let quality = 100;

let resize = (active) => {
  if (active) resizecanvas(canvasAnimated, ctxAnimated);
  else resizecanvas(canvasStatic, ctxStatic);
};

function resizecanvas(canvas, ctx) {
  const realWidth = window.innerWidth * window.devicePixelRatio;
  const realHeight = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  if (quality == 100) {
    canvas.width = realWidth;
    canvas.height = realHeight;
  } else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  let cellWidth = 14;
  if (canvas.width > canvas.height) {
    if (canvas.height / 9.3 < canvas.width / cellWidth) dh = canvas.height / 9.3;
    else dh = canvas.width / cellWidth;
    orientation = "w";
  } else {
    if (canvas.height / cellWidth < canvas.width / 9) dh = canvas.height / cellWidth;
    else dh = canvas.width / 9;
    orientation = "h";
  }
  if (orientation == "w") {
    shiftX = (canvas.width - dh * 8) / 2;
    shiftY = (canvas.height - dh * 9) / 2;
  }
  if (orientation == "h") {
    shiftX = (canvas.width - dh * 9) / 2;
    shiftY = (canvas.height - dh * 8) / 2;
  }
  // ctx.fillStyle = "rgb(0,0,0)";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dh = even(dh);
}

let even = (n) =>
  // n;
  Math.ceil(n);
// Math.round(n) - Math.round(n) % 2;

let drawImageEven = (img, x, y, w, h, animate) => {
  let ctx = animate ? ctxAnimated : ctxStatic;
  if (!animate) ctx.drawImage(img, even(x), even(y), even(w), even(h));
  else ctx.drawImage(img, x, y, w, h);
};

function drawBackground(name) {
  let s = dh;
  let img = getImgRaw(name + ".bck", s);
  for (var tileX = 0; tileX < canvas.width; tileX += dh) {
    for (var tileY = 0; tileY < canvas.height; tileY += dh) {
      drawImageEven(img, tileX, tileY, dh, dh);
    }
  }
}
function drawBoard() {
  ctx.save();
  for (x = shiftX; x <= canvas.width; x += dh) {
    for (y = shiftY; y <= canvas.height; y += dh) {
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
}

function drawTxt(txt, x, y, width, color, size, font, animate) {
  let ctx = animate ? ctxAnimated : ctxStatic;
  color = color || "#222";
  size = size || 100;
  width = width || 0;
  size = dh * 0.26 * size * 0.01;
  font = font || "Play";
  font = size + "px " + font;
  ctx.font = font;
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";

  wrapText(ctx, txt, x * dh + shiftX, y * dh + shiftY, dh * width, 25);

  // drawBubble(x, y, px, py);

  function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
    marginLeft = marginLeft + 0.1 * dh;
    // maxWidth = maxWidth - 0.1 * dh;
    let lines = 1;
    let originalmarginttop = marginTop;
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
    // console.log(text);
    let doit = () => {
      let words = text.split(" ");
      let countWords = words.length;
      let line = "";
      for (let n = 0; n < countWords; n++) {
        let testLine = line + words[n] + " ";
        let testWidth = context.measureText(testLine).width;
        if (testWidth > maxWidth - 0.1 * dh || words[n] === "\n") {
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
    // if (lines > 1) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(x * dh + shiftX, y * dh + shiftY, maxWidth, lineHeight * lines * 1.1);
    ctx.globalAlpha = 1.0;
    // }
    marginTop = originalmarginttop;
    doit();
  }

  function drawBubble(x, y, px, py) {
    x = x * dh + shiftX;
    y = y * dh + shiftY;
    px = px * dh + shiftX + dh / 2;
    py = py * dh + shiftY + dh / 2;
    let w = dh * 3;
    let h = 100;
    let radius = 20;
    var r = x + w;
    var b = y + h;
    if (py < y || py > y + h) {
      var con1 = Math.min(Math.max(x + radius, px - 10), r - radius - 20);
      var con2 = Math.min(Math.max(x + radius + 20, px + 10), r - radius);
    } else {
      var con1 = Math.min(Math.max(y + radius, py - 10), b - radius - 20);
      var con2 = Math.min(Math.max(y + radius + 20, py + 10), b - radius);
    }
    var dir;
    if (py < y) dir = 2;
    if (py > y) dir = 3;
    if (px < x && py >= y && py <= b) dir = 0;
    if (px > x && py >= y && py <= b) dir = 1;
    if (px >= x && px <= r && py >= y && py <= b) dir = -1;
    ctx.beginPath();
    ctx.strokeStyle = "#222222";
    ctx.lineWidth = "2";
    ctx.moveTo(x + radius, y);
    if (dir == 2) {
      ctx.lineTo(con1, y);
      ctx.lineTo(px, py);
      ctx.lineTo(con2, y);
      ctx.lineTo(r - radius, y);
    } else ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    if (dir == 1) {
      ctx.lineTo(r, con1);
      ctx.lineTo(px, py);
      ctx.lineTo(r, con2);
      ctx.lineTo(r, b - radius);
    } else ctx.lineTo(r, b - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    if (dir == 3) {
      ctx.lineTo(con2, b);
      ctx.lineTo(px, py);
      ctx.lineTo(con1, b);
      ctx.lineTo(x + radius, b);
    } else ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    if (dir == 0) {
      ctx.lineTo(x, con2);
      ctx.lineTo(px, py);
      ctx.lineTo(x, con1);
      ctx.lineTo(x, y + radius);
    } else ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
  }
}

let drawShadow = (df, color) => {
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
};

function getImgRaw(name) {
  img = grafio(name + ".raw");
  if (img === undefined || img === null) img = questionmark;
  return img;
}

function getImg(name, s, mask) {
  s = even(s);
  let img = grafio(name + "." + s);

  if (img === undefined || img === null) {
    img = grafio(name + ".raw");
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

function drawImg(name, x, y, animate) {
  let p = dh / 10;
  let s = dh + 2 * p;
  let img = getImg(name, s);
  drawImageEven(img, x * dh - p + shiftX, y * dh - p + shiftY, s, s, animate);
}

function drawImgNormal(name, x, y, mask, animate) {
  let img;
  mask = false;
  if (mask && mask.length > 0) img = getImg(name, dh, mask[0]);
  else img = getImg(name, dh);

  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh, dh, animate);
}

function drawImgFieldConnection(name, x, y, mask, animate) {
  let img;
  mask = false;
  if (mask && mask.length > 0) img = getImg(name, dh, mask[0]);
  else img = getImg(name, dh);
  if (img && img != questionmark)
    drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh, dh, animate);
}

function drawSpoil(name, x, y) {
  let p = dh / 10;
  let img = getImg(name + ".spoil", dh);
  // let img = getImg(name, x, y, mask[0]);
  // ctx.drawImage(img, x * dh-p + shiftX, y * dh-p, dh +2*p, dh+2*p);
  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh, dh);
}

function drawStatus(name, x, y) {
  let p = dh / 10;
  let s = dh + 2 * p;
  let img = getImg(name + ".stt", s);
  drawImageEven(img, x * dh - p + shiftX, y * dh - p * 2 + shiftY, s, s, true);
}

function drawField(name, x, y, mask) {
  let p = dh / 15;
  let h = even(dh + 2 * p);
  let w = even(img.width * (h / img.height));
  let img = getImg(name, h, mask[0]);
  if (mask[1] > 0.5) {
    ctx.save();
    ctx.scale(-1, 1);
    drawImageEven(img, (x * dh - p + shiftX) * -1 - w, y * dh - p + shiftY, w, h);
    ctx.restore();
  } else {
    drawImageEven(img, x * dh - p + shiftX, y * dh - p + shiftY, w, h);
  }
}
// }
function drawTrail(name, x, y) {
  let img = getImg(name + ".trl", dh);
  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh, dh, false);
}

function drawAkt(name, x, y, ws, hs, style) {
  let ctx = ctxAnimated;
  img = getImg(name + ".akt", dh);
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
    px = (dh / 1000) * ws;
    py = (dh / 1000) * hs;
  }
  // console.log(px, py);

  let w = dh + 2 * px;
  let h = dh + 2 * py;
  drawImageEven(img, x * dh - px + shiftX, y * dh - py * 2 + shiftY, w, h, true);

  ctx.restore();

  // drawImageEven(img, x * dh - px + shiftX, y * dh - 0.1 * dh - py * 2 + shiftY, w, h, animate);
}

function drawLife(quantity, x, y) {
  let p = dh / 10;

  // let img = getImg('life' + quantity, x, y);
  // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh / 3 + 2 * p, dh / 3 + 2 * p);
  drawTxt(quantity + "", x, y, "#328094", "2.3vmin monospace");
  // ctx.drawImage(img, x * dh - p*0.5  + shiftX, y * dh- p*0.5, dh/4 + 2 * p, dh/4 + 2 * p);
  // ctx.drawImage(img, x * dh  + shiftX, y * dh, dh/8 + 2 * p, dh/8 + 2 * p);
}

function drawSticker(name, x, y, team, animate) {
  let color = false;
  if (team == 1) color = "team1Ready";
  if (team == 2) color = "team2Ready";
  if (team == 3) color = "team3";

  let size = dh * 0.6;
  img = getImg(name + ".unit" + "." + color, size);

  x = x + 0.2;
  y = y + 0.4;
  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, size, size, animate);
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

function drawPropUnit(name, x, y, m, team, isReady, isActive, ws, hs, animate) {
  let ctx = animate ? ctxAnimated : ctxStatic;
  let color = determineColor(team, isReady, isActive); // Смотрите определение функции ниже

  let px = 0;
  let py = 0;
  if (ws && hs) {
    px = (dh / 1000) * ws;
    py = (dh / 1000) * hs;
  }

  let w = dh + 2 * px;
  let h = dh + 2 * py;

  let img;
  if (!animate) img = getImg(name + ".unit" + "." + color, h);
  else img = getImg(name + ".unit" + "." + color, (h + w) / 2);

  let newYOffset = y * dh - 0.1 * dh - py * 2 + shiftY;

  if (m) {
    ctx.save();
    ctx.scale(-1, 1);
    drawImageEven(img, (x * dh - px + shiftX) * -1 - w, newYOffset, w, h, animate);
    ctx.restore();
  } else {
    drawImageEven(img, x * dh - px + shiftX, newYOffset, w, h, animate);
  }
}

function drawPropUnitCropped(name, x, y, m, team, isReady, isActive, ws, hs, animate, cropPercent) {
  let ctx = animate ? ctxAnimated : ctxStatic;
  let color = determineColor(team, isReady, isActive); // Смотрите определение функции ниже

  let px = 0;
  let py = 0;
  if (ws && hs) {
    px = (dh / 1000) * ws;
    py = (dh / 1000) * hs;
  }

  let w = dh + 2 * px;
  let h = dh + 2 * py;
  let cropStartY = (h * cropPercent) / 100;
  let croppedH = h - cropStartY;

  let img;
  if (!animate) img = getImg(name + ".unit" + "." + color, h);
  else img = getImg(name + ".unit" + "." + color, (h + w) / 2);
  let newYOffset;

  if (cropPercent < 0) {
    newYOffset = y * dh - 0.1 * dh - py * 2 + shiftY - cropStartY;
  } else newYOffset = y * dh - 0.1 * dh - py * 2 + shiftY;

  if (m) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
      img,
      0,
      -cropStartY,
      w,
      croppedH,
      (x * dh - px + shiftX) * -1 - w,
      newYOffset,
      w,
      croppedH
    );
    ctx.restore();
  } else {
    ctx.drawImage(img, 0, -cropStartY, w, croppedH, x * dh - px + shiftX, newYOffset, w, croppedH);
  }
}

function drawProp(name, x, y, ws, hs, animate) {
  let px = 0;
  let py = 0;
  if (ws && hs) {
    px = (dh / 1000) * ws;
    py = (dh / 1000) * hs;
  }

  let w = dh + 2 * px;
  let h = dh + 2 * py;
  let img;
  if (!animate) img = getImg(name, h);
  else img = getImg(name, (h + w) / 2);
  drawImageEven(img, x * dh - px + shiftX, y * dh - 0.1 * dh - py * 2 + shiftY, w, h, animate);
}

function drawSize(name, x, y, w, h, animate) {
  img = getImg(name, w * dh);
  // ctx.drawImage(img, 0, 0, img.width, img.height/2 ,x * dh + shiftX, y * dh + shiftY, dh*2 , dh );
  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh * w, dh * h, animate);
}

function drawPanel(name, x, y, w, h) {
  img = getImgRaw(name + ".pnl");
  drawImageEven(img, x * dh + shiftX, y * dh + shiftY, dh * w, dh * h, false);
}

// function drawWeb(name, x, y, w, h) {
//     let img = grafio(name);
//     if (img === undefined || img === null) {
//         img = questionmark;
//     }
//     // img.src=canvas.toDataURL("https://i.stack.imgur.com/MxDfS.png");
//     // console.log(img);
//     ctx.drawImage(img, x * dh + shiftX, y * dh, dh * w, dh * h);
// }

// function drawHolst(x, y) {
//     for (let h of model.holst[x][y]) {
//         drawImg(h, x + model.trx, y + model.try);
//     }
// }

function message(string) {
  $("#console").prepend("<br><br>");
  $("#console").prepend(string);

  var txt = $("#console").html().substring(0, 600);
  $("#console").html(txt);
}

function initGrafio() {
  let imgs = new Map();
  return (url) => {
    let img = imgs.get(url);

    if (img) {
      return img.complete && img.naturalWidth !== 0 ? img : null;
    } else {
      img = new Image();
      img.onload = () => {
        render();
      };
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
