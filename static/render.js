let wait = 0

let renderanimated = (diff) => {

    resize(true)

    if (!diff)
        diff = 0;
    if (diff > 100)
        diff = 100

    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            renderunit(x, y, diff);
        }
    }
    renderakt();
    rendertrail();

    if (!socket.connected)
        tip('Разорвано соединение с сервером...', 3, 3, '#F00', 5, 200);


    rendertip();
    if (local.focus) {
        drawImg('focus', local.focus.x, local.focus.y)
    }
    if (diff) {
        let fps = (parseInt(1000 / diff)).toString()
        let y = 0
        if (fps < 50)
            drawTxt('fps ' + fps, 8, y, "#000000", undefined, undefined, true);
        if (quality < 100)
            drawTxt('quality ' + quality, 8, y += 0.5, "#000000", undefined, undefined, true);
        // drawTxt('wait ' + wait, 8, y += 0.5, "#000000", undefined, undefined, true);
        // drawTxt('dh ' + dh, 8, y += 0.5, "#000000", undefined, undefined, true);

        if (wait > 100) {
            if (fps < 45 && quality > 30)
                quality -= 5
            if (fps > 55) {
                quality += 5
                if (quality > 100)
                    quality = 100
            }
            wait = 0
        } else
            wait++
    }
    // drawTxt('size ' + (dh + 2 * (dh / 10)), 8, 0.5, "#000000", undefined, undefined, true);

}

let render = () => {

    resize();

    if (data.history)
        drawBackground('history');
    else {
        if (data.turn == 1) {
            drawBackground('edgeTurn');
        } else {
            drawBackground('edgeWait');
        }
    }

    renderpanel();
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            renderfield(x, y)
        }
        for (let x = 0; x < 9; x++) {
            renderspoil(x, y);
        }
        // for (let x = 0; x < 9; x++) {
        //   renderunit(x, y, diff);
        // }
        if (data.chooseteam || !data.bonus == 'ready') {
            for (let x = 0; x < 9; x++) {
                if (data.field[x][y] == 'team1')
                    drawImgNormal('bluestart', x, y);
                if (data.field[x][y] == 'team2')
                    drawImgNormal('orangestart', x, y);
            }
        }
    }

    if (local.sandclock) {
        drawImg('sandclock', local.sandclock.x, local.sandclock.y)
    }



}
let renderpanel = () => {
    let c = [
        [-2, 0],
        [-2, 2],
        [-2, 8],
        [-2, 6],
        [-2, 4]
    ]
    if (orientation == 'h') {
        c.forEach(e => e.reverse());
    }

    if (data.bonus == 'choose') {
        let i = 0;
        for (let fx = -2; fx < 0; fx++) {
            for (let fy = 0; fy < 9; fy++) {
                if (orientation == 'h') {
                    drawImgNormal('bonus', fy, fx)
                    drawTxt(("0" + i).slice(-2), fy + 0.20, fx + 0.20, '#000', 170)
                } else {
                    drawImgNormal('bonus', fx, fy)
                    drawTxt(("0" + i).slice(-2), fx + 0.24, fy + 0.30, '#000', 170)
                }
                i++
            }
        }
    } else {

        drawSize('help', c[4][0], c[4][1], 2, 2)

        if (data.finished) {
            // drawSize('frame', c[3][0], c[3][1], 2, 2)
        } else {
            // drawSize('help', c[3][0], c[3][1], 2, 2)
            if (orientation == 'w') {
                drawSize('surrender', c[2][0], c[2][1], 2, 1)
            } else
                drawSize('surrenderh', c[2][0], c[2][1], 1, 2)

        }

        if (local.frame > 0)
            drawSize('frame', c[3][0], c[3][1], 2, 2)

        if (data.bonus == 'choose') {
            drawSize('choose', c[0][0], c[0][1], 2, 2)
        } else if (data.bonus == 'wait') {
            drawSize('wait', c[0][0], c[0][1], 2, 2)
        }
        else if (data.turn) {
            drawSize('turn', c[0][0], c[0][1], 2, 2)
        } else {
            drawSize('turnEnemy', c[0][0], c[0][1], 2, 2)
        }
        if (data.win == 'win') {
            drawSize('win', c[0][0], c[0][1], 2, 2)
        }
        if (data.win == 'defeat') {
            drawSize('defeat', c[0][0], c[0][1], 2, 2)
        }

        // drawTxt(local.fisher[0] + '', c[0][0] + 0.15, c[0][1] + 0.4 + 0.15, '#090')
        // drawTxt(local.fisher[1] + '', c[0][0] + 1 + 0.15, c[0][1] + 0.4 + 0.15, '#f00')
        let team1 = 0
        let team2 = 0

        data.unit.forEach((u) => {
            if (u.color == 1)
                team1 += u.life
            if (u.color == 2)
                team2 += u.life
        });
        if (team1 - team2 > 0) {
            team1 -= team2;
            team2 -= team2
        } else {
            team2 -= team1;
            team1 -= team1
        }

        let arr = [];
        data.unit.forEach((u) => {
            if (u.color == 1 && u.isReady && !u.isActive) {
                arr.push(u);
            }
        });
        drawSize('next', c[1][0], c[1][1], 2, 2)

        drawTxt(arr.length + '', c[1][0] + 0.15, c[1][1] + 1.6, '#222')
        drawTxt(data.leftturns + '', c[0][0] + 1.5, c[0][1] + 0.1, '#222');

        let goldtext = data.gold[0] + '';
        drawTxt(goldtext, c[1][0] + 0.15, c[1][1] + 0.3, '#090')
        drawTxt(data.gold[1] + '', c[1][0] + 0.15, c[1][1] + 0.6 + 0.3, '#f00')
        drawTxt(local.unitcn + '', c[1][0] + 1.6, c[1][1] + 0.3, '#222')
        drawTxt(local.unitencn + '', c[1][0] + 1.6, c[1][1] + 0.6 + 0.3, '#222')


        // drawTxt(team1 + '', c[1][0] + 0.15, c[1][1] + 0.5 + 0.15, '#090')
        // drawTxt(team2 + '', c[1][0] + 1 + 0.15, c[1][1] + 0.5 + 0.15, '#f00')

    }

}



let renderunit = (x, y, diff) => {
    let u = data.unit.filter(u => u.x == x && u.y == y)[0];


    if (u) {
        let groundsize = 0

        if (data.field[x][y] == 'grass' || data.field[x][y] == 'team1' || data.field[x][y] == 'team2')
            groundsize = 56

        if (!data.order || u.x != data.order.akt.x || u.y != data.order.akt.y) {
            let sizeadd = 0
            if ((u.isReady || u.isActive) && u.color == 1)
                sizeadd = local.cadr * 20 / 1000;
            // else
            //   sizeadd = local.cadr * 8 / 1000;
            if (data.field[x][y] == 'ground') {
                // if (u.isReady == undefined || u.isActive == undefined) console.log(u, 'why?')
                drawProp(u.img, u.x, u.y, u.m, u.color, u.isReady, u.isActive, groundsize - sizeadd, groundsize + sizeadd, true);
            }
            else
                if (data.field[x][y] == 'water') {
                    // if (u.isReady == undefined || u.isActive == undefined) console.log(u, 'why?')
                    drawProp(u.img, u.x, u.y, u.m, u.color, u.isReady, u.isActive, groundsize - sizeadd, groundsize + sizeadd, true);
                    drawImgNormal('drawn', x, y, fieldmask[x][y], true);
                }
                else {
                    // if (u.isReady == undefined || u.isActive == undefined) console.log(u, 'why?')
                    drawProp(u.img, u.x, u.y, u.m, u.color, u.isReady, u.isActive, groundsize - sizeadd, groundsize + sizeadd, true);
                }
            if (u.sticker)
                drawSticker(u.sticker.img, x, y, u.sticker.color)
            u.status.forEach(stt => drawStatus(stt, u.x, u.y, u.m, u.color, u.isReady, u.isActive));

        } else if (data.order.akt.img == 'move') {
            console.log(data.order.unit.x, u.x, data.order.akt.img)
            let progress

            if (!u.progress)
                u.progress = 0;
            u.progress += diff
            if (u.progress > 1000)
                progress = 1000
            else
                progress = u.progress
            let xd = (u.x * (progress / 500) + data.order.unit.x * ((1000 - progress) / 500)) / 2 - Math.sin(progress / 25) / 150
            let yd = (u.y * (progress / 500) + data.order.unit.y * ((1000 - progress) / 500)) / 2 - Math.sin(progress / 25) / 45
            if (u.isReady == undefined || u.isActive == undefined) console.log(u, 'why?')
            drawProp(u.img, xd, yd, u.m, u.color, u.isReady, u.isActive, groundsize, groundsize, true);
            if (data.field[x][y] == 'water')
                drawImgNormal('drawn', xd, yd, fieldmask[x][y], true);

            if (u.sticker)
                drawSticker(u.sticker.img, x, y, u.sticker.color)
            u.status.forEach(stt => drawStatus(stt, xd, yd, u.m, u.color, u.isReady, u.isActive));
        } else {
            console.log(data.order.akt.img)
            if (!u.progress)
                u.progress = 0;
            u.progress += diff
            if (u.progress > 500)
                progress = 0
            else
                progress = u.progress
            let dx = 0
            let dy = 0
            let easingCoef = progress / 1000;
            var easing = Math.pow(easingCoef - 1, 3) + 1;
            dx = u.x + (easing * (Math.cos(progress * 0.1) + Math.cos(progress * 0.3115))) / 40;
            dy = u.y + (easing * (Math.sin(progress * 0.05) + Math.sin(progress * 0.057113))) / 40;
            if (u.isReady == undefined || u.isActive == undefined) console.log(u, 'why?')
            drawProp(u.img, dx, dy, u.m, u.color, u.isReady, u.isActive, groundsize, groundsize, true)
            if (data.field[x][y] == 'water')
                drawImgNormal('drawn', dx, dy, fieldmask[x][y], true);
            u.status.forEach(stt => drawStatus(stt, dx, dy, u.m, u.color, u.isReady, u.isActive));
            if (u.sticker)
                drawSticker(u.sticker.img, x, y, u.sticker.color)

        }

        if (data.field[x][y] == 'water' && (!u.progress || u.progress > 1000))
            drawImgNormal('drawn', x, y, fieldmask[x][y]);

    }
    // if (data.field[x][y] == 'water')
    //     drawImgNormal('drawn', x, y, fieldmask[x][y], true);
}


let renderfield = (x, y) => {
    let v = 0
    drawImgNormal(data.field[x][y], x, y + v, fieldmask[x][y]);
    if (data.field[x][y - 1] && data.field[x][y - 1] != data.field[x][y])
        drawImgNormal('ns' + data.field[x][y - 1] + data.field[x][y], x, y - 0.5, fieldmask[x][y]);
    if (data.field[x - 1] && data.field[x - 1][y] != data.field[x][y])
        drawImgNormal('we' + data.field[x - 1][y] + data.field[x][y], x - 0.5, y, fieldmask[x][y]);
    if (data.turn)
        if (data.field[x][y] == 'team1' && data.gold[0] >= local.cost)
            drawImg('canBuild', x, y,);
}



let renderspoil = (x, y) => {
    let u = data.spoil.filter(u => u.x == x && u.y == y);
    u.forEach((s) => {
        drawSpoil(s.name, s.x, s.y);
    });
}
let renderakt = () => {
    let right
    if (local.unit && local.unit.akt) {
        local.unit.akt.forEach(a => {
            right = false
            data.unit.forEach(u => {
                if (u.x == a.x && u.y == a.y && u.color == local.unit.color) {
                    right = true
                }
            }
            );
            drawAkt(a.img, a.x, a.y, right);
        });
        drawImg('focus', local.unit.x, local.unit.y)
    } else if (local.build) {
        data.unit.forEach(u => drawAkt('build', u.x, u.y));
        drawImg('focus', local.build.x, local.build.y)
    }

}
let rendertrail = () => {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            let u = data.trail.filter(u => u.x == x && u.y == y);
            u.forEach((t) => {
                drawTrail(t.img, t.x, t.y);
            });
        }
    }
}
let rendertip = () => {
    if (local.tip && local.tip.dur > 0)
        drawTxt(local.tip.text, local.tip.x, local.tip.y, local.tip.color, local.tip.size, false, true);
}