const sharp = require('sharp')
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

const input = '../img/'
const output = '../img.nosync/'


const lresize = (s, file) => {
    let name = file.substring(0, file.length - 4)
    sharp(input + file)
        .resize(s, s,) // or .greyscale()
        .toFile(output + name + '.' + s + '.png')
    console.log(name + '.' + s + '.png');
}
const convert = (file) => {

    let name = file.substring(0, file.length - 4)
    let fn = () => {
        for (let i = 30; i < 200; i += 1) {
            lresize(i, file);
        }
        sharp(input + file).toFile(output + name + '.raw.png')
    }
    // fn();

    if (!fs.existsSync(input + file) || !fs.existsSync(output + name + '.raw.png'))
        fn();
    else {
        const img1 = PNG.sync.read(fs.readFileSync(input + file));
        const img2 = PNG.sync.read(fs.readFileSync(output + name + '.raw.png'));
        const { width, height } = img1;
        const diff = new PNG({ width, height });
        let difference;
        if (img1.data.length != img2.data.length)
            difference = 'differnt size', img1.data.length, img2.data.length;
        else
            difference = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.3 });
        console.log(name, difference)
        if (difference != 0)
            fn();
    }
}

fs.readdir(input, (err, files) => {
    // files = ['grass.png', 'ground.png', 'frame.png']
    files.forEach(file => {
        if (file[0] != '.') {
            convert(file)
        }
        // else console.log(file)
    });
});