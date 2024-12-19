import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";

const arr = Array2D.fromString(DataFull)
const antinodes = new Array2D<boolean>(arr.Size, false)
const map = new Map<string, XY[]>()

arr.forEach((v, xy) => {
    if (v !== undefined) {
        if (map.has(v))
            map.get(v)!.push(xy)
        else map.set(v, [xy])
    }
})

map.forEach((freqs, freq) => {
    if (freq === '#') return
    freqs.forEachPair(([xy1, xy2]) => {
        const d = xy2.minus(xy1)
        for (let i = 0; antinodes.TrySet(xy1.minus(d.times(i)), true); i++) { }
        for (let i = 0; antinodes.TrySet(xy2.plus(d.times(i)), true); i++) { }
    }, true, true, false)
})

antinodes.Log()

antinodes.Count(n => n === true).Log()