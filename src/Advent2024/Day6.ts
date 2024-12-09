import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";


const arr = Array2D.fromString(DataFull)
const initialGuard = arr.Find('^')!

const path = new Set<string>()
{
    const a = arr.Copy()
    let guard = initialGuard.Copy()
    let direction = XY.North
    while (true) {
        const newpos = guard.plus(direction)
        if (!a.XYWithinSize(newpos)) break
        if (a.get(newpos) === '#') {
            direction = direction.RotateCW()
            continue
        }
        guard.plusEQ(direction)
        path.add(guard.toString())
    }
    path.size.Log()
}

path.delete(initialGuard.toString())

let count = 0

path.forEach(xys => {
    const xy = XY.fromString(xys)

    if (arr.get(xy) !== '.') return

    const guard = initialGuard.Copy()
    let direction = XY.North

    const prevs = new Set<string>([guard.toString() + direction.toString()])

    for (let i = 0; ; i++) {
        const str = guard.toString() + direction.toString()
        if (i > 0 && prevs.has(str)) {
            count++
            return
        }

        const newpos = guard.plus(direction)
        if (!arr.XYWithinSize(newpos)) {
            return
        }
        if (arr.get(newpos) === '#' || newpos.EQ(xy)) {
            direction = direction.RotateCW()
        }
        else {
            guard.plusEQ(direction)
            prevs.add(str)
        }
    }
})

count.Log()
