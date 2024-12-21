import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";


const map = Array2D.fromArray(Data.map(l => l.toIntList(''))).Log()

function recurse(xy: XY, n: num): num {
    return n === 9 ? 1 : 
    map.Neighbours(xy, false).Accumulate(([nxy, nn]) => 
        nn === n + 1 ? recurse(nxy, nn) : 0)
}

map.Entries().Accumulate(([zxy, n]) => n === 0 ? recurse(zxy, 0) : 0).Log()