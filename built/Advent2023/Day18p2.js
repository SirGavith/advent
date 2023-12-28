"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XY_1 = require("../Glib/XY");
const main_1 = require("../main");
// const loop = Data.map(v => 
//     v.split(' ').Run(
//         d => d === 'R' ? XY.Right : d === 'L' ? XY.Left : d === 'U' ? XY.Down : XY.Up,
//         d => d.toInt())
//     )
const loop = main_1.Data.map(v => [v.split(' ')[2].slice(2, -1)].Run(n => ({ '0': XY_1.XY.Right, '1': XY_1.XY.Up, '2': XY_1.XY.Left, '3': XY_1.XY.Down }[n.at(-1)]), n => n.slice(0, 5).toInt(16))).Log();
let sum = 0;
const logShape = (loop) => {
    const path = [];
    let pos = new XY_1.XY;
    for (let i = 0; i < loop.length; i++)
        for (let j = 0; j < loop[i][1]; j++) {
            pos.plusEQ(loop[i][0]);
            path.push(pos.Copy());
        }
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
    const arr = new XY_1.Array2D(maxXY.minus(minXY).plus(1), false);
    path.forEach(xy => arr.set(xy.minus(minXY), true));
    // sum.Log()
    arr.Log();
};
let cuts = 0;
while (loop.length > 4) {
    //find bumps
    for (let i = 0; i < loop.length; i++) {
        let [a, b, c] = [loop[i], loop[(i + 1) % loop.length], loop[(i + 2) % loop.length]];
        if (a[0].EQ(b[0].times(-1))) {
            //find max
            if (a[1] > b[1]) {
                // console.log('wisp a')
                sum += b[1];
                a[1] -= b[1];
                loop.splice((i + 1) % loop.length, 1);
            }
            else if (b[1] > a[1]) {
                // console.log('wisp b')
                sum += a[1];
                b[1] -= a[1];
                loop.splice(i, 1);
            }
            // else console.log('wisp c')
            cuts++;
            continue;
        }
        if (!(a[0] === b[0].RotateCW() && a[0] === c[0].RotateCW().RotateCW()))
            continue;
        // a[1] >= c[1]
        //see if line intersects cut
        //find ends of cut
        let pos1 = new XY_1.XY;
        let pos2 = new XY_1.XY;
        if (a[1] >= c[1]) {
            let pos = new XY_1.XY;
            for (let j = 0; j < loop.length; j++) {
                pos.plusEQ(loop[j][0].times(loop[j][1]));
                if (j === i) {
                    pos1 = pos.Copy();
                }
                else if (j === i + 2) {
                    pos2 = pos.Copy().minus(loop[j][0]);
                    pos1.plusEQ(loop[j][0].times(loop[j][1] - 1));
                    break;
                }
            }
        }
        else /* a[1] < c[1] */ {
            let pos = new XY_1.XY;
            for (let j = 0; j < loop.length; j++) {
                if (j === i) {
                    pos1 = pos.Copy().plus(loop[j][0]);
                    pos2.minusEQ(loop[j][0].times(loop[j][1] - 1));
                }
                else if (j === i + 2) {
                    pos2.plusEQ(pos);
                    break;
                }
                pos.plusEQ(loop[j][0].times(loop[j][1]));
            }
        }
        //TODO add for eq case and 
        //path must not go through any tile between but not equal to pos1 -> pos2
        let valid = true;
        let pos = new XY_1.XY;
        for (let j = 0; j < loop.length; j++) {
            let nPos = pos.plus(loop[j][0].times(loop[j][1]));
            //see if this side crosses cut
            if (pos1.X === pos2.X) {
                //vertical cut
                if (pos.Y > [pos1.Y, pos2.Y].Min() &&
                    pos.Y < [pos1.Y, pos2.Y].Max() && //Y is within bounds
                    (pos1.X === pos.X || pos1.X === nPos.X || // ends on cut
                        pos1.X - pos.X < 0 !== pos1.X - nPos.X < 0) //same sign
                ) {
                    //cut is invalid
                    valid = false;
                    break;
                }
            }
            else if (pos1.Y === pos2.Y) {
                //horizontal cut
                if (pos.X > [pos1.X, pos2.X].Min() &&
                    pos.X < [pos1.X, pos2.X].Max() && //Y is within bounds
                    (pos1.Y === pos.Y || pos1.Y === nPos.Y || // ends on cut
                        pos1.Y - pos.Y < 0 !== pos1.Y - nPos.Y < 0) //same sign
                ) {
                    //cut is invalid
                    valid = false;
                    break;
                }
            }
            else
                throw new Error;
            pos = nPos;
        }
        if (!valid)
            continue;
        if (!pos.EQ(new XY_1.XY))
            throw new Error;
        // console.log('cut')
        //make the cut
        if (a[1] > c[1]) {
            sum += (b[1] + 1) * c[1];
            a[1] -= c[1];
            loop.splice(loop.indexOf(c), 1);
        }
        else if (a[1] === c[1]) {
            sum += (b[1] + 1) * c[1];
            loop.splice(loop.indexOf(a), 1);
            loop.splice(loop.indexOf(c), 1);
        }
        else {
            sum += (b[1] + 1) * a[1];
            c[1] -= a[1];
            loop.splice(loop.indexOf(a), 1);
        }
        cuts++;
        // if (cuts > 290) {
        //     cuts.Log()
        //     logShape(loop)
        // }
        // sum.Log()
        //defragment loop
        for (let i = 0; i < loop.length;) {
            if (loop[i][0] === loop[(i + 1) % loop.length][0]) {
                loop[i][1] += loop[(i + 1) % loop.length][1];
                loop.splice((i + 1) % loop.length, 1);
            }
            else
                i++;
        }
    }
}
// logShape(loop)
sum.Log();
//add final square or line
if (loop.length === 4) {
    sum += (loop[0][1] + 1) * (loop[1][1] + 1);
}
else if (loop.length === 2) {
    sum += loop[0][1] + 1;
}
// logShape(loop)
sum.Log();
