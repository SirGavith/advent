"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
let pos = new XY_1.XY;
let path = [pos];
main_1.Data.forEach(v => {
    const [dir, dist] = v.split(' ').Run(d => d === 'R' ? XY_1.XY.Right : d === 'L' ? XY_1.XY.Left : d === 'U' ? XY_1.XY.Down : XY_1.XY.Up, d => d.toInt());
    for (let i = 0; i < dist; i++) {
        pos.plusEQ(dir);
        path.push(pos.Copy());
    }
});
let minXY = new XY_1.XY(Number.MAX_VALUE);
let maxXY = new XY_1.XY(Number.MIN_VALUE);
path.forEach(xy => {
    if (xy.X < minXY.X)
        minXY.X = xy.X;
    if (xy.Y < minXY.Y)
        minXY.Y = xy.Y;
    if (xy.X > maxXY.X)
        maxXY.X = xy.X;
    if (xy.Y > maxXY.Y)
        maxXY.Y = xy.Y;
});
const arr = new XY_1.Array2D(maxXY.minus(minXY).plus(2), false);
path.forEach(xy => arr.set(xy.minus(minXY), true));
arr.Log();
let trenched = false;
let O = new XY_1.XY(0, 1);
for (; !trenched; O.X++)
    trenched = arr.get(O);
O.Log();
const l = [O];
while (l.length > 0) {
    const xy = l.pop();
    arr.set(xy, true);
    arr.Neighbours(xy).forEach(([xy2, set]) => {
        if (!set)
            l.push(xy2);
    });
}
arr.Log().reduce((sum, v) => sum + (v ? 1 : 0), 0).Log();
