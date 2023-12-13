import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";

//part 1
{
// let arr = Array2D.fromArray(Data.map(l => l.toArray()))


// for (let y = 0; y < arr.Size.Y; y++) {
//     if (arr.getRow(y).every(c => c === '.')) {
//         arr.Array.splice(y, 0, Array(arr.Size.X).fill('.'))
//         arr.Size.Y++
//         y++
//     }
// }

// arr = arr.Transpose()
// for (let y = 0; y < arr.Size.Y; y++) {
//     if (arr.getRow(y).every(c => c === '.')) {
//         arr.Array.splice(y, 0, Array(arr.Size.X).fill('.'))
//         arr.Size.Y++
//         y++
//     }
// }
// arr = arr.Transpose()

// // arr.Log()

// const galaxies: XY[] = []

// arr.forEach((c,xy) => {
//     if (c === '#') galaxies.push(xy)
// })

// galaxies.Log()

// let count = 0
// let atph = 0

// galaxies.forEachPair((val) => {
//     atph += val[1].minus(val[0]).TaxicabNorm
//     count++
// }, false, false)

// count.Log()
// console.log(atph/2)
}

//part 2

const galaxies: XY[] = []
const cols: number[] = []
const rows: number[] = []

const arr = Array2D.fromArray(Data.map(l => l.toArray()))
arr.forEach((c, xy) => {
    if (c === '#') galaxies.push(xy)
})
for (let y = 0; y < arr.Size.Y; y++) {
    if (arr.getRow(y).every(c => c === '.'))
        rows.push(y)
}

for (let x = 0; x < arr.Size.X; x++) {
    if (arr.getCol(x).every(c => c === '.'))
        cols.push(x)
}
// galaxies.Log()
rows.Log()
cols.Log()

let count = 0
let atph = 0

galaxies.map(g => {
    let newG = g.Copy()
    for (let i = 0; i < rows.length; i++) { if (rows[i] > g.Y) break; newG.Y += 1000000 -1 }
    for (let i = 0; i < cols.length; i++) { if (cols[i] > g.X) break; newG.X += 1000000 -1 }
    return newG
}).Log()

.forEach((val, i, a) => {
    a.forEach((val2, ii) => {
        if (i === ii) return
        atph += val2.minus(val).TaxicabNorm
        count++
    })
})

console.log(atph/2)