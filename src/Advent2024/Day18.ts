import { PriorityQueue } from "../Glib/PriorityQueue";
import { Array2D, XY } from "../Glib/XY";
import { Data, UseExample } from "../main";

const Size = UseExample ? new XY(7) : new XY(71)


const arr = new Array2D<boolean>(Size, false)

const dest = Size.minus(1)



function canExit() {
    const unvisited = new Map<string, num>()
    arr.forEach((v, xy) => { if (!v) unvisited.set(xy.toString(), Number.MAX_VALUE) })
    unvisited.set(XY.Zero.toString(), 0)

    function getLeast() {
        let l = Number.MAX_VALUE, xystr = ''
        unvisited.forEach((v, xys) => {
            if (v < l) { l = v; xystr = xys }
        })
        unvisited.delete(xystr)
        return [XY.fromString(xystr), l] as const
    }

    while (unvisited.size > 0) {
        const [xy, dist] = getLeast()
        if (dist === Number.MAX_VALUE) return false

        if (xy.EQ(dest)) {
            console.log('found', dist)
            return true
        }

        arr.Neighbours(xy, false).forEach(([nxy, n]) => {
            const nxystr = nxy.toString()
            if (unvisited.has(nxystr) && unvisited.get(nxystr)! > dist + 1) {
                unvisited.set(nxystr, dist + 1)
            }
        })
    }
    return false
}

let t = 0
for (; canExit(); t++) {
    arr.set(XY.fromString(Data[t]), true)
}

arr.Log()
t.Log()
Data[t - 1].Log()


// class D {
//     constructor(public xy: XY, public Dist: num) {}
// }

// const q = new PriorityQueue<D>((a,b) => a.Dist < b.Dist)
// q.push(new D(new XY, 0))
// while (!q.isEmpty()) {
//     const d = q.pop()!
//     if (d.xy.EQ(dest)) {
//         console.log('found', d.Dist)
//         break
//     }
//     arr.set(d.xy, d.Dist)

//     arr.Neighbours(d.xy, false).forEach(([nxy, n]) => {
//         if (n !== -1) {
//             q.push(new D(nxy, d.Dist + 1))
//         }
//     })
// }
