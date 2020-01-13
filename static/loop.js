
// window.requestAnimFrame = (function (callback) {
//     return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
//         function (callback) {
//             window.setTimeout(callback, 1000 / 5);
//         };
// })();

// function step(lastTime) {
//     let time = new Date().getTime();
//     let timeDiff = time - lastTime;
//     lastTime = time;

//     onStep(timeDiff);
//     requestAnimFrame(function () {
//         step(lastTime);
//     });
// }