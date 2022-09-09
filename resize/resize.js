const sharp = require('sharp')
const fs = require('fs');
const { imageHash } = require('image-hash');

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
        for (let i = 30; i < 200; i += 2) {
            lresize(i, file);
        }
        sharp(input + file).toFile(output + name + '.raw.png')
    }
    fn();

    // if (!fs.existsSync(input + file) || !fs.existsSync(output + name + '.raw.png'))
    //     fn();
    // else
    //     imageHash(input + file, 16, true, (error, data) => {
    //         if (error) throw (error);
    //         imageHash(output + name + '.raw.png', 16, true, (error, data2) => {
    //             if (error) throw (error);
    //             else if (data == data2) {
    //                 // fn();
    //                 console.log(file + ' is same');
    //             }
    //             else {
    //                 console.log(data);
    //                 console.log(data2);
    //                 fn();
    //             }
    //         });
    //     });
}

fs.readdir(input, (err, files) => {
    files.forEach(file => {
        if (file[0] != '.') {
            convert(file)
        }
        // else console.log(file)
    });
});