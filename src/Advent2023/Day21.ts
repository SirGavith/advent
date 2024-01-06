import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";

const arr = Array2D.fromString(DataFull).Log()

// let xys = []
let xys = new Set<string>([arr.Find('S')!.toString()])

xys.Log()

for (let i = 0; i < 100; i++) {
    const nxys = new Set<string>()

    xys.forEach(xy => {
        XY.fromString(xy).Neighbours().forEach(n => {
            const pos = n.Abs().div(arr.Size).Ceil().times(arr.Size).plus(n).mod(arr.Size)
            // console.log(n, pos)
            if (arr.get(pos) !== '#') nxys.add(n.toString())
        })
    })

    // nxys.Log()
    i.Log()

    xys = nxys
}
xys.Log()
xys.size.Log()