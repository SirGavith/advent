"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
let arrO = XY_1.Array2D.fromString(main_1.DataFull).Log();
const arr = XY_1.Array2D.fromString(main_1.DataFull).Log();
const tilt = (x, y, dir) => {
    let xy = new XY_1.XY(x, y);
    if (arr.get(xy) !== 'O')
        return;
    const nxy = new XY_1.XY(x, y);
    while (arr.get(nxy.plus(dir)) === '.') {
        nxy.plusEQ(dir);
    }
    if (!nxy.EQ(xy)) {
        arr.set(xy, '.');
        arr.set(nxy, 'O');
    }
};
//first run loop indefinitely to find period with O = example ? 10 : 1000, loops so rocks have 'settled'
//then run to  I = 1000000000 % p + p * a; where a is large enough such that I > O
//ex: loop period = 7
//real: loop period = 17
for (let i = 0; i < 7 + 17 * 60; i++) {
    //NORTH, WEST
    for (const dir of [XY_1.XY.Down, XY_1.XY.Left])
        for (let y = 0; y < arr.Size.Y; y++)
            for (let x = 0; x < arr.Size.X; x++)
                tilt(x, y, dir);
    //SOUTH, EAST
    for (const dir of [XY_1.XY.Up, XY_1.XY.Right])
        for (let y = arr.Array.length - 1; y >= 0; y--)
            for (let x = arr.Array[y].length - 1; x >= 0; x--)
                tilt(x, y, dir);
    if (arr.every((v, xy) => v === arrO.get(xy))) {
        console.log('found loop', i);
    }
    if (i % 1_000 === 0)
        i.Log();
    if (i === 1000) {
        arrO = arr.Copy();
    }
}
arr.Log();
//part 1
arr.reduce((sum, r, xy) => {
    if (r !== 'O')
        return sum;
    return sum + (arr.Size.Y - xy.Y);
}, 0).Log();
