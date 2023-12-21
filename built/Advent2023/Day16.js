"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
const arr = XY_1.Array2D.fromString(main_1.DataFull);
const energized = (init) => {
    const arr3 = arr.map(_ => new Set);
    const stack = [init];
    while (stack.length > 0) {
        const [pos, dir] = stack.pop();
        if (arr.get(pos) === undefined)
            continue;
        if (arr3.get(pos).has(dir))
            continue;
        arr3.get(pos).add(dir);
        if (arr.get(pos) === '.') {
            stack.push([pos.plus(dir), dir]);
        }
        else if (arr.get(pos) === '/') {
            let nDir = null;
            if (dir === XY_1.XY.Down)
                nDir = XY_1.XY.Right;
            else if (dir === XY_1.XY.Left)
                nDir = XY_1.XY.Up;
            else if (dir === XY_1.XY.Up)
                nDir = XY_1.XY.Left;
            else if (dir === XY_1.XY.Right)
                nDir = XY_1.XY.Down;
            stack.push([pos.plus(nDir), nDir]);
        }
        else if (arr.get(pos) === '\\') {
            let nDir = null;
            if (dir === XY_1.XY.Down)
                nDir = XY_1.XY.Left;
            else if (dir === XY_1.XY.Left)
                nDir = XY_1.XY.Down;
            else if (dir === XY_1.XY.Up)
                nDir = XY_1.XY.Right;
            else if (dir === XY_1.XY.Right)
                nDir = XY_1.XY.Up;
            stack.push([pos.plus(nDir), nDir]);
        }
        else if (arr.get(pos) === '-') {
            if (dir === XY_1.XY.Right || dir === XY_1.XY.Left)
                stack.push([pos.plus(dir), dir]);
            else {
                stack.push([pos.plus(XY_1.XY.Right), XY_1.XY.Right]);
                stack.push([pos.plus(XY_1.XY.Left), XY_1.XY.Left]);
            }
        }
        else if (arr.get(pos) === '|') {
            if (dir === XY_1.XY.Up || dir === XY_1.XY.Down)
                stack.push([pos.plus(dir), dir]);
            else {
                stack.push([pos.plus(XY_1.XY.Down), XY_1.XY.Down]);
                stack.push([pos.plus(XY_1.XY.Up), XY_1.XY.Up]);
            }
        }
    }
    const e = arr3.reduce((sum, v) => sum + (v.size > 0 ? 1 : 0), 0);
    if (e > max)
        max = e;
};
let max = 0;
for (let y = 0; y < arr.Size.Y; y++) {
    energized([new XY_1.XY(0, y), XY_1.XY.Right]);
    energized([new XY_1.XY(arr.Size.X - 1, y), XY_1.XY.Left]);
}
for (let x = 0; x < arr.Size.X; x++) {
    energized([new XY_1.XY(x, 0), XY_1.XY.Up]);
    energized([new XY_1.XY(x, arr.Size.Y - 1), XY_1.XY.Down]);
}
max.Log();
