"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
const arr = XY_1.Array2D.fromString(main_1.DataFull).Log();
// let xys = []
let xys = new Set([arr.Find('S').toString()]);
xys.Log();
for (let i = 0; i < 1000; i++) {
    const nxys = new Set();
    xys.forEach(xy => {
        XY_1.XY.fromString(xy).Neighbours().forEach(n => {
            const pos = n.Abs().div(arr.Size).Ceil().times(arr.Size).plus(n).mod(arr.Size);
            // console.log(n, pos)
            if (arr.get(pos) !== '#')
                nxys.add(n.toString());
        });
    });
    // nxys.Log()
    i.Log();
    xys = nxys;
}
xys.Log();
xys.size.Log();
