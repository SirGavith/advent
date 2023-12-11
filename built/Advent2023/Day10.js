"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
const arr = XY_1.Array2D.fromArray(main_1.Data.map(l => l.toArray()));
const origin = arr.Find('S').Log();
const path = [origin];
let offset = undefined;
if (arr.get(origin.plus(1, 0))?.in('J-7')) {
    //go right
    offset = XY_1.XY.Right;
}
else if (arr.get(origin.plus(-1, 0))?.in('L-F')) {
    //go left
    offset = XY_1.XY.Left;
}
else if (arr.get(origin.plus(0, 1))?.in('L|J')) {
    //go down
    offset = XY_1.XY.Up;
}
else {
    throw new Error; //should find two
}
path.push(origin.plus(offset));
path.Log();
for (let i = 1;; i++) {
    const current = path.at(-1);
    if (arr.get(current) === '|') {
        if ()
            ;
    }
    if (arr.get(current.plus(1, 0))?.in('J-7')) {
        //go right
        offset = XY_1.XY.Right;
    }
    else if (arr.get(current.plus(-1, 0))?.in('L-F')) {
        //go left
        offset = XY_1.XY.Left;
    }
    else if (arr.get(current.plus(0, 1))?.in('L|J')) {
        //go down
        offset = XY_1.XY.Up;
    }
    else {
        throw new Error; //should find two
    }
}
