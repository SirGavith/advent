"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
//for part 1, make line 24 and 41 smudges === 0
//part 2
main_1.DataFull.Split2Lines().map(m => {
    const map = XY_1.Array2D.fromString(m);
    for (let i = 1; i < map.Size.X; i++) {
        //see if reflection at x=i
        let smudges = 0;
        for (let j = 0; j < map.Size.X - i; j++) {
            const lCol = map.getCol(i - j - 1);
            const rCol = map.getCol(i + j);
            if (!lCol[0] || !rCol[0])
                break;
            lCol.forEach((l, y) => {
                if (l !== rCol[y])
                    smudges++;
            });
        }
        if (smudges === 1)
            return i.Log();
    }
    for (let i = 1; i < map.Size.Y; i++) {
        //see if reflection at y=i
        let smudges = 0;
        for (let j = 0; j < map.Size.Y - i; j++) {
            const lRow = map.getRow(i - j - 1);
            const rRow = map.getRow(i + j);
            if (!lRow || !rRow)
                break;
            lRow.forEach((l, x) => {
                if (l !== rRow[x])
                    smudges++;
            });
        }
        if (smudges === 1)
            return (i * 100).Log();
    }
    throw new Error;
}).Sum().Log();
