import { Array2D, XY } from "../Glib/XY";
import { Data, UseExample } from "../main";

const Size = UseExample ? new XY(11, 7) : new XY(101, 103)


class Robot {
    constructor(public XY: XY, public V: XY) {}
}

const robots = Data.map(l => {
    const [xy, v] = l.split(' ').map(t => XY.fromString(t.slice(2)))
    return new Robot(xy, v)
})

for (let t = 0; t < 10000; t++) {
    robots.forEach(r => {
        r.XY.plusEQ(r.V)
        r.XY.modEQ(Size)
    })

    // if (t % 100000 === 0) t.Log()

    if (t % 101 !== 1) continue

    // const arr = new Array2D<number>(Size)
    
    // robots.forEach(r => {
    //     arr.set(r.XY, (arr.get(r.XY) ?? 0) + 1)
    // })
    
    // arr.Log();
    
    // const scores = ([[XY.Zero, Size.minus(3).div(2)],
    // [new XY((Size.X + 1) / 2, 0), new XY(Size.X - 1, (Size.Y - 3) / 2)],
    // [new XY(0, (Size.Y + 1 )/ 2), new XY((Size.X - 3) / 2, Size.Y - 1)],
    // [Size.plus(1).div(2), Size.minus(1)]] as [XY, XY][]).map(([xy1, xy2], i) => {
    //     let count = 0
    //     xy2.foreachCombination(xy => count += arr.get(xy) ?? 0, xy1)
    //     // xy2.foreachCombination(xy => arr.set(xy, i), xy1)
    //     return count
    // })
    const arr = new Array2D<string>(Size)
    t.Log()
    robots.forEach(r => {
        arr.set(r.XY, '█')
    })
    arr.Log()

    // let symmetric = arr.Array.every(row => {
    //     for (let i = 0; i < row.length / 2 - 1; i++) {
    //         if (row[i] !== row.at(-i - 1)) return false
    //     }
    //     return true
    // })


    // if (symmetric) {
    //     console.log('symmetry', t)

    //     t.Log()
    //     arr.Log()
    // }
}
// arr.Log()


// 75
// 487