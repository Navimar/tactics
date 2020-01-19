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
    if (canvas.width > canvas.height) {
        dh = (canvas.height / 9) * 0.98;
        shiftX = (canvas.width - dh * 9) / 2;
    } else {
        dh = canvas.width / (9 + 4);
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
        for (y = 0; y <= canvas.height; y += dh) {
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
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

function drawTxt(txt, x, y, color, font) {
    color = color || '#222';
    ctx.font = font || '13pt Verdana';
    ctx.fillStyle = 'white';
    ctx.textBaseline = "top";
    //console.log(txt);
    // ctx.fillText(txt, x * dh + shiftX, y * dh);
    // ctx.strokeText(txt,  x * dh + shiftX, y * dh);
    wrapText(ctx, txt, x * dh + shiftX + 10, y * dh + 10, dh * 3, 25);

    // drawBubble(x, y, px, py);

    function wrapText(context, text, marginLeft, marginTop, maxWidth, lineHeight) {
        function dt() {
            ctx.fillStyle = color;
            for (let blx = 1; blx <= 3; blx++) {
                for (let bly = 1; bly <= 3; bly++) {
                    context.fillText(line, marginLeft + blx, marginTop + bly);
                    context.fillText(line, marginLeft - blx, marginTop - bly);
                    context.fillText(line, marginLeft + blx, marginTop - bly);
                    context.fillText(line, marginLeft - blx, marginTop + bly);
                }
            }
            ctx.font = font || '13pt Verdana';
            ctx.fillStyle = 'white';
            context.fillText(line, marginLeft, marginTop);
        }
        // console.log(text);
        let words = text.split(" ");
        let countWords = words.length;
        let line = "";
        for (let n = 0; n < countWords; n++) {
            let testLine = line + words[n] + " ";
            let testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth || words[n] === '\n') {
                dt();
                if (words[n] === '\n') {
                    line = words[n].slice(1);
                } else {
                    line = words[n] + " ";
                }
                marginTop += lineHeight;
            }
            else {
                line = testLine;
            }
            dt();
        }

    }

    function drawBubble(x, y, px, py) {
        x = x * dh + shiftX;
        y = y * dh;
        px = px * dh + shiftX + dh / 2;
        py = py * dh + dh / 2;
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
function getImg(name, x, y) {
    let img = grafio(name);
    if (img === undefined || img === null) {
        img = questionmark;
        drawTxt(name, x, y, '#897f0e');
    }
    return img
}
function drawImg(name, x, y) {
    let p = dh / 10;
    let img = getImg(name, x, y);
    ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh + 2 * p, dh + 2 * p);
    // ctx.drawImage(img, x * dh + shiftX, y * dh, dh, dh);
}

function drawTrail(name, x, y) {
    let img = getImg(name + '.trl', x, y);
    ctx.drawImage(img, x * dh + shiftX, y * dh, dh, dh);
}
function drawAkt(name, x, y) {
    let p = 0;
    let img = getImg(name + '.akt', x, y);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 0;
    ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh + 2 * p, dh + 2 * p);
    ctx.restore();

    // ctx.drawImage(img, x * dh + shiftX, y * dh, dh, dh);
}

function drawLife(quantity, x, y) {
    let p = dh / 10;

    // let img = getImg('life' + quantity, x, y);
    // ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, dh / 3 + 2 * p, dh / 3 + 2 * p);
    drawTxt(quantity + '', x - 0.1, y - 0.1, '#328094', '25pt monospace');
    // ctx.drawImage(img, x * dh - p*0.5  + shiftX, y * dh- p*0.5, dh/4 + 2 * p, dh/4 + 2 * p);
    // ctx.drawImage(img, x * dh  + shiftX, y * dh, dh/8 + 2 * p, dh/8 + 2 * p);
}

function drawProp(name, x, y, m, team, isReady, isActive) {
    let color = false;
    if (team == 2 && isReady) color = 'rgba(255,0,0,1)';
    if (team == 2 && !isReady) color = 'rgba(190,0,190,1)';
    if (team == 1 && isReady) color = 'rgba(255,255,255,1)';
    if (team == 1 && !isReady) color = 'rgba(30,190,40,1)';
    if (isActive) color = 'rgba(0,255,0,1)';
    let p = dh / 10;
    let img = getImg(name, x, y);
    let h = dh + 2 * p;
    let w = img.width * (h / img.height);

    if (m) {
        let df = () => {
            ctx.drawImage(img, (x * dh - p + shiftX) * -1 - w, y * dh - p, w, h);
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
            ctx.drawImage(img, x * dh - p + shiftX, y * dh - p, w, h);
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


function drawImgNormal(name, x, y) {
    let p = dh / 10;
    let img = getImg(name);
    // ctx.drawImage(img, x * dh-p + shiftX, y * dh-p, dh +2*p, dh+2*p);
    ctx.drawImage(img, x * dh + shiftX, y * dh, dh, dh);
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
    // console.log(img);
    ctx.drawImage(img, x * dh + shiftX, y * dh, dh * w, dh * h);
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
    return (url, onLoad) => {
        let img = imgs.get(url);

        if (img) {
            return img.complete && img.naturalWidth !== 0 ? img : null;
        } else {
            img = new Image();
            img.onload = onLoad;
            img.src = url + ".png";
            imgs.set(url, img);
            return null;
        }
    }
}

