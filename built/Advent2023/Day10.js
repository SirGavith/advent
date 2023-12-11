"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
const arr = XY_1.Array2D.fromArray(main_1.Data.map(l => l.toArray()));
const origin = arr.Find('S').Log();
const path = [origin];
let offset = XY_1.XY.Right;
path.push(origin.plus(offset));
while (true) {
    const current = path.at(-1);
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
    path.push(current.plus(offset));
}
path.Log();
((path.length - 1) / 2).Log();
