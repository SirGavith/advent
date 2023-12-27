import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";

let pos = new XY
let path: XY[] = [pos]
Data.forEach(v => {
    const [dir, dist] = v.split(' ').Run(
        d => d === 'R' ? XY.Right : d === 'L' ? XY.Left : d === 'U' ? XY.Down : XY.Up,
        d => d.toInt())

    for (let i = 0; i < dist; i++) {
        pos.plusEQ(dir)
        path.push(pos.Copy())
    }
})

let minXY = new XY(Number.MAX_VALUE)
let maxXY = new XY(Number.MIN_VALUE)

path.forEach(xy => {
    if (xy.X < minXY.X) minXY.X = xy.X
    if (xy.Y < minXY.Y) minXY.Y = xy.Y
    if (xy.X > maxXY.X) maxXY.X = xy.X
    if (xy.Y > maxXY.Y) maxXY.Y = xy.Y
})

const arr = new Array2D<boolean>(maxXY.minus(minXY).plus(2), false)

path.forEach(xy => 
    arr.set(xy.minus(minXY), true)
)
arr.Log()

let trenched = false
let O = new XY(0,1)
for (; !trenched; O.X++)
    trenched = arr.get(O)!
O.Log()


const l = [O]
while (l.length > 0) {
    const xy = l.pop()!
    arr.set(xy, true)
    
    arr.Neighbours(xy).forEach(([xy2, set]) => {
        if (!set) l.push(xy2)
    })
}

arr.Log().reduce((sum, v) => sum + (v ? 1 : 0), 0).Log()