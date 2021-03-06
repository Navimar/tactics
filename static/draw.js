const grafio = initGrafio();

//load
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const questionmark = new Image;
questionmark.src = '/undefined.png';
let dh = 0;
let shiftX = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // canvas.width = window.visualViewport.width;
  // canvas.height = window.visualViewport.height;
  if (canvas.width > canvas.height) {
    dh = (canvas.height / 9);
    shiftX = (canvas.width - dh * 9) / 2;
    shiftY = 0
    orientation = 'w'
  } else {
    dh = canvas.width / (9);
    shiftX = 0;
    shiftY = (canvas.height - dh * 9) / 2;
    orientation = 'h'
  }
  ctx.fillStyle = "rgb(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawBackground(name) {
  let img = getImg(name, 0, 0);
  for (var tileX = 0; tileX < canvas.width; tileX += dh) {
    for (var tileY = 0; tileY < canvas.height; tileY += dh) {
      ctx.drawImage(img, tileX, tileY, dh, dh);
    }
  }
}
function drawBoard() {
  ctx.save();

  for (x = shiftX; x <= canvas.width; x += dh) {
    for (y = shiftY; y <= canvas.height; y += dh) {
      ctx.strokeStyle = 'rgba(200,200,200,0.1)';
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

function drawTxt(txt, x, y, color, size, font) {
  color = color || '#222';
  size = size || 100
  size = dh * 0.24 * size * 0.01
  font = font || 'Verdana'
  font = size + 'px ' + font
  ctx.font = font;
  ctx.fillStyle = 'white';
  ctx.textBaseline = "top";

  wrapText(ctx, txt, x * dh + shiftX, y * dh + shiftY, dh * 4, 25);

  // drawBubble(x, y, px, py);

  function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
    let lines = 1
    let originalmarginttop = marginTop
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
      lineHeight = ctx.font.substring(0, 2) * 1.1;
      // lineHeight=100
      ctx.fillStyle = 'white';
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
        if (testWidth > maxWidth || words[n] === '\n') {
          dt(line);
          if (words[n] === '\n') {
            line = words[n].slice(1);
          } else {
            line = words[n] + " ";
          }
          marginTop += lineHeight;
          lines++
        }
        else {
          line = testLine;
        }
        dt(line);
      }
    }
    doit()
    if (lines > 1) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'black';
      ctx.fillRect(x * dh + shiftX - maxWidth * 0.02, y * dh + shiftY, maxWidth, lineHeight * lines * 1.1);
      ctx.globalAlpha = 1.0;
    }
    marginTop = originalmarginttop
    doit()
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
    }
    else {
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
    }
    else ctx.lineTo(r - radius, y);
    ctx.quadraticCurveTo(r, y, r, y + radius);
    if (dir == 1) {
      ctx.lineTo(r, con1);
      ctx.lineTo(px, py);
      ctx.lineTo(r, con2);
      ctx.lineTo(r, b - radius);
    }
    else ctx.lineTo(r, b - radius);
    ctx.quadraticCurveTo(r, b, r - radius, b);
    if (dir == 3) {
      ctx.lineTo(con2, b);
      ctx.lineTo(px, py);
      ctx.lineTo(con1, b);
      ctx.lineTo(x + radius, b);
    }
    else ctx.lineTo(x + radius, b);
    ctx.quadraticCurveTo(x, b, x, b - radius);
    if (dir == 0) {
      ctx.lineTo(x, con2);
      ctx.lineTo(px, py);
      ctx.lineTo(x, con1);
      ctx.lineTo(x, y + radius);
    }
    else ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.stroke();
  }
}

let drawShadow = (df, color) => {
  let ss = 3;
  ctx.shadowColor = color;
  ctx.globalCompositeOperation = 'source-over';
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
}
function getImg(name, x, y, mask) {
  let img = grafio(name);
  if (img === undefined || img === null) {
    img = questionmark;
    drawTxt(name, x, y, '#897f0e');
  }
  if (mask != undefined) {
    let arr = [img]
    let i = 1;
    do {
      img = grafio(name + i)
      if (img !== undefined && img !== null) {
        arr.push(img)
      }
      i++;
    } while (img !== undefined && img !== null)
    // console.log(arr, mask)
    return arr[Math.floor(mask * arr.length)]
  } else {
    return img
  }
}
function drawImg(name, x, y) {
  let p = dh / 10;
  let img = getImg(name, x, y);
  ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, dh + 2 * p, dh + 2 * p);
  // ctx.drawImage(img, x * dh + shiftX, y * dh+shiftY, dh, dh);
}

function drawSpoil(name, x, y) {
  let p = dh / 10;
  let img = getImg(name + '.spoil', x, y);
  // let img = getImg(name, x, y, mask[0]);
  // ctx.drawImage(img, x * dh-p + shiftX, y * dh-p, dh +2*p, dh+2*p);
  ctx.drawImage(img, x * dh + shiftX, y * dh + shiftY, dh, dh);
}

function drawStatus(name, x, y) {
  let p = dh / 10;
  let img = getImg(name + '.stt', x, y);
  ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, dh + 2 * p, dh + 2 * p);
  // ctx.drawImage(img, x * dh + shiftX, y * dh+shiftY, dh, dh);
}
function drawField(name, x, y, mask) {
  // if (name == 'team1') {
  //   drawProp('team', x, y, false, '1', false, false);
  // } else if (name == 'team2') {
  //   drawProp('team', x, y, false, '2', true, false);
  // }else{
  let p = dh / 15;
  let img = getImg(name, x, y, mask[0]);
  let h = dh + 2 * p;
  let w = img.width * (h / img.height);
  if (mask[1] > 0.5) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(img, (x * dh - p + shiftX) * -1 - w, y * dh - p + shiftY, w, h);
    // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh + 2 * p, dh + 2 * p);
    ctx.restore();
  } else {
    ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, w, h);
    // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh + 2 * p+shiftY, dh + 2 * p);
  }
}
// }
function drawTrail(name, x, y) {
  let img = getImg(name + '.trl', x, y);
  ctx.drawImage(img, x * dh + shiftX, y * dh + shiftY, dh, dh);
}
function drawAkt(name, x, y) {
  let p = 0;

  // ctx.save();
  // let img = getImg('underAkt', x, y);
  // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, dh + 2 * p, dh + 2 * p);
  // ctx.restore();

  img = getImg(name + '.akt', x, y);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.shadowBlur = 0;
  ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, dh + 2 * p, dh + 2 * p);
  ctx.restore();




  // ctx.drawImage(img, x * dh + shiftX, y * dh, dh, dh);
}

function drawLife(quantity, x, y) {
  let p = dh / 10;

  // let img = getImg('life' + quantity, x, y);
  // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh / 3 + 2 * p, dh / 3 + 2 * p);
  drawTxt(quantity + '', x, y, '#328094', '2.3vmin monospace');
  // ctx.drawImage(img, x * dh - p*0.5  + shiftX, y * dh- p*0.5, dh/4 + 2 * p, dh/4 + 2 * p);
  // ctx.drawImage(img, x * dh  + shiftX, y * dh, dh/8 + 2 * p, dh/8 + 2 * p);
}

function drawProp(name, x, y, m, team, isReady, isActive, size) {
  let color = false;
  if (!data.chooseteam && data.bonus == 'ready') {
    if (team == 2 && isReady) color = 'rgba(255,0,0,1)';
    if (team == 2 && !isReady) color = 'rgba(190,0,190,1)';
    if (team == 1 && isReady && data.turn) color = 'rgba(255,255,255,1)';
    if (team == 1 && isReady && !data.turn) color = 'rgba(30,190,40,1)';
    if (team == 1 && !isReady) color = 'rgba(30,190,40,1)';
  } else {
    if (team == 1 && isReady) color = 'rgba(47, 0, 255,1)';
    if (team == 2 && isReady) color = 'rgba(255, 149, 0,1)';
  }
  if (isActive && team == 1) color = 'rgba(0,255,0,1)';
  if (team == 3) color = 'rgba(255, 255, 0,1)';
  let p = 0
  if (size)
    p = dh / size;
  let img = getImg(name, x, y);
  let h = dh + 2 * p;
  let w = img.width * (h / img.height);

  if (m) {
    let df = () => {
      // ctx.drawImage(img, 0, 0, img.width, img.height *0.75 ,(x * dh - p + shiftX) * -1 - w, y * dh - p + shiftY, w, h*0.75);
      ctx.drawImage(img, (x * dh - p + shiftX) * -1 - w, y * dh - p + shiftY, w, h);

    }
    ctx.save();
    ctx.scale(-1, 1);
    if (color) {
      drawShadow(df, color);
    }
    ctx.restore();
    df();

  } else {
    let df = () => {
      ctx.drawImage(img, x * dh - p + shiftX, y * dh - p + shiftY, w, h);
    }
    ctx.save();
    if (color) {
      drawShadow(df, color);
    }
    ctx.restore();
    df();
    // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, w, h);

  }
}


function drawImgNormal(name, x, y, mask) {
  let p = dh / 10;
  let img = getImg(name);
  // let img = getImg(name, x, y, mask[0]);
  // ctx.drawImage(img, x * dh-p + shiftX, y * dh-p, dh +2*p, dh+2*p);
  ctx.drawImage(img, x * dh + shiftX, y * dh + shiftY, dh, dh);
}


// function animate(i, x, y, fx, fy, p) {
//     let dx = fx + (x - fx) * p / 100;
//     let dy = fy + (y - fy) * p / 100;
//     drawImg("from", x, y);
//     drawImg(i, dx, dy);
//
// }

function drawSize(name, x, y, w, h) {
  let img = grafio(name);
  if (img === undefined || img === null) {
    img = questionmark;
  }
  // ctx.drawImage(img, 0, 0, img.width, img.height/2 ,x * dh + shiftX, y * dh + shiftY, dh*2 , dh );
  ctx.drawImage(img, x * dh + shiftX, y * dh + shiftY, dh * w, dh * h);
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
  $('#console').prepend("<br><br>");
  $('#console').prepend(string);

  var txt = $('#console').html().substring(0, 600);
  $('#console').html(txt);
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
      imgs.set(url, img);
      return null;
    }
  }
}




