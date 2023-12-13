"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
const arr = XY_1.Array2D.fromArray(main_1.Data.map(l => l.toArray()));
const arr2 = new XY_1.Array2D(arr.Size);
const origin = arr.Find('S').Log();
let offset = XY_1.XY.Right;
arr2.set(origin, 'S');
let pathLen = 1;
let current = origin.plus(offset);
while (true) {
    if (arr.get(current) === 'S')
        break;
    switch (arr.get(current)) {
        case 'L':
            if (offset.EQ(XY_1.XY.Up))
                offset = XY_1.XY.Right;
            else if (offset.EQ(XY_1.XY.Left))
                offset = XY_1.XY.Down;
            break;
        case 'J':
            if (offset.EQ(XY_1.XY.Up))
                offset = XY_1.XY.Left;
            else if (offset.EQ(XY_1.XY.Right))
                offset = XY_1.XY.Down;
            break;
        case '7':
            if (offset.EQ(XY_1.XY.Down))
                offset = XY_1.XY.Left;
            else if (offset.EQ(XY_1.XY.Right))
                offset = XY_1.XY.Up;
            break;
        case 'F':
            if (offset.EQ(XY_1.XY.Down))
                offset = XY_1.XY.Right;
            else if (offset.EQ(XY_1.XY.Left))
                offset = XY_1.XY.Up;
            break;
    }
    arr2.set(current, arr.get(current));
    current = current.plus(offset);
    pathLen++;
}
console.log(pathLen / 2);
let count = 0;
let dir = XY_1.XY.Zero;
for (let y = 0; y < arr2.Size.Y; y++) {
    let counter = 0;
    for (let x = 0; x < arr2.Size.X; x++) {
        const xy = new XY_1.XY(x, y);
        const char = arr2.get(xy);
        if (char === '|')
            counter++;
        else if (char === 'L') {
            counter += 0.5;
            dir = XY_1.XY.Down;
        }
        else if (char === 'F') {
            counter += 0.5;
            dir = XY_1.XY.Up;
        }
        else if (char === '7') {
            if (dir === XY_1.XY.Down)
                counter += 0.5;
            if (dir === XY_1.XY.Up)
                counter += 1.5;
        }
        else if (char === 'J') {
            if (dir === XY_1.XY.Down)
                counter += 1.5;
            if (dir === XY_1.XY.Up)
                counter += 0.5;
        }
        else if (char === undefined && counter % 2 === 1)
            count++;
    }
}
count.Log();
