const sharp = require('sharp');
const fs = require('fs');
const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;
const Jimp = require('jimp');
const gm = require('gm').subClass({ imageMagick: true });

const input = '../img/';
const output = '../img.nosync/';

const colors = {
    'team2Ready': Jimp.rgbaToInt(255, 0, 0, 255),
    'team2NotReady': Jimp.rgbaToInt(190, 0, 190, 255),
    'team1Ready': Jimp.rgbaToInt(255, 255, 255, 255),
    'team1NotReady': Jimp.rgbaToInt(30, 190, 40, 255),
    'team1choose': Jimp.rgbaToInt(47, 0, 255, 255),
    'team2choose': Jimp.rgbaToInt(255, 149, 0, 255),
    'team1active': Jimp.rgbaToInt(0, 255, 0, 255),
    'team3': Jimp.rgbaToInt(255, 255, 0, 255)
};


const lresize = async (size, file) => {
    let name = file.substring(0, file.length - 4);
    const img = await Jimp.read(input + file);
    let height = img.bitmap.height;
    const borderweight = 1;

    if (file.includes('.unit.png')) {
        for (const color in colors) {
            let imgOriginal = img.clone();
            let imgBordered = img.clone();
            let imgColored = img.clone();
            imgColored.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
                const isTransparent = this.bitmap.data[idx + 3] === 0;
                if (!isTransparent) {
                    const { r, g, b, a } = Jimp.intToRGBA(colors[color]);
                    // Set red channel
                    this.bitmap.data[idx] = r;
                    // Set green channel
                    this.bitmap.data[idx + 1] = g;
                    // Set blue channel
                    this.bitmap.data[idx + 2] = b;
                    // Set alpha channel (optional)
                    this.bitmap.data[idx + 3] = a;
                }
            })

            imgBordered
                .blit(imgColored, height / 100 * borderweight, height / 100 * borderweight)
                .blit(imgColored, -height / 100 * borderweight, -height / 100 * borderweight)
                .blit(imgColored, +height / 100 * borderweight, -height / 100 * borderweight)
                .blit(imgColored, -height / 100 * borderweight, +height / 100 * borderweight)
                .blit(imgOriginal, 0, 0)
                .resize(size, size, Jimp.RESIZE_LANCZOS);
            await imgBordered.writeAsync(output + name + '.' + color + '.' + size + '.png');
            console.log(name + '.' + color + '.' + size + '.png');
        }
    } else {
        img.resize(size, size, Jimp.RESIZE_LANCZOS);
        await img.writeAsync(output + name + '.' + size + '.png');
        console.log(name + '.' + size + '.png');
    }
};

const convert = async (file) => {
    let from = 40
    let to = 220
    let name = file.substring(0, file.length - 4);
    let fn = async () => {
        fs.copyFile(input + file, output + name + '.raw.png', (err) => {
            if (err) {
                console.error('Произошла ошибка при копировании файла:', err);
            }
        });
        for (let i = from; i < to; i += 1) {
            await lresize(i, file); // Use await to ensure sequential execution of lresize()
        }
    };

    if (!fs.existsSync(input + file) || !fs.existsSync(output + name + '.raw.png')) {
        await fn();
    } else {
        // const img1 = fs.readFile(input + file);
        // const img2 = fs.readFile(output + name + '.raw.png');

        let stats1 = fs.statSync(input + file);
        let stats2 = fs.statSync(output + name + '.raw.png');

        const { width, height } = sharp(input + file).metadata();
        const diff = new PNG({ width, height });
        let difference;

        if (stats1.size == stats2.size) {
            // console.log(name);
            console.log(name + ' OK');
        } else {
            console.log(name,stats1.size, stats2.size)

            await fn();

        }

        // if (img1.length !== img2.length || width !== diff.width || height !== diff.height) {
        //     difference = 'different size: ' + img1.length + ', ' + img2.length;
        // } else {
        //     difference = pixelmatch(img1, img2, diff.data, width, height, { threshold: 0.3 });
        // }

        // console.log(name, difference);

        // if (difference !== 0) {
        //     await fn();
        // }
    }
};

fs.readdir(input, async (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file[0] !== '.') {
            await convert(file); // Use await to ensure sequential processing of files
        }
    }
});
