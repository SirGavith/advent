import { off } from "process";
import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";
import { BgBlack, BgCyan, BgGreen, BgMagenta, BgRed, BgYellow, Reset } from "../Glib/Console";

const arr = Array2D.fromString(DataFull).Log()

// let xys = []
let xys = new Set<string>([arr.Find('S')!.toString()])

xys.Log()

const steps = arr.Size.X + ((arr.Size.X - 1) / 2) + 5 //ODD
console.log('going to ', steps)

for (let i = 0; i < steps; i++) {
    const nxys = new Set<string>()
    xys.forEach(xy => {
        XY.fromString(xy).Neighbours().forEach(n => {
            const pos = n.Abs().div(arr.Size).Ceil().times(arr.Size).plus(n).mod(arr.Size)
            // console.log(n, pos)
            if (arr.get(pos) !== '#') nxys.add(n.toString())
        })
    })
    i.Log()
    xys = nxys
}
// xys.Log()
// xys.size.Log()

const [size, offset] = XY.ArraySizeOffset(xys.toArray().map(s => XY.fromString(s)))
const modulusOffset = size.div(arr.Size).Ceil().times(arr.Size)
const arr2 = new Array2D<string>(size, '.')



arr2.forEach((_, xy2) => {
    const xy = xy2.minus(offset)

    const pos = xy.plus(modulusOffset).mod(arr.Size)
    if (arr.get(pos) === '#') arr2.set(xy2, '#')
    if (xys.has(xy.toString())) {
        arr2.set(xy2, 'O')
    }
})

// arr2.set(offset.plus(5), 'S')


let aCount = 0
let bCount = 0

arr2.Array.forEach((r, y) => {
    console.log(r.map((v, x) => {
        let colors = []

        if (new XY(x, y).minus(offset.minus(0, 0)).TaxicabNorm < 65 || 
            new XY(x, y).minus(offset.minus(0, 1)).TaxicabNorm < 65 || 
            new XY(x, y).minus(offset.minus(1, 0)).TaxicabNorm < 65 || 
            new XY(x, y).minus(offset.minus(1, 1)).TaxicabNorm < 65 ) {
            colors.push(BgMagenta)
        }

        if (new XY(x, y).minus(offset.plus(131).minus(0, 0)).TaxicabNorm < 65 ||
            new XY(x, y).minus(offset.plus(131).minus(0, 1)).TaxicabNorm < 65 ||
            new XY(x, y).minus(offset.plus(131).minus(1, 0)).TaxicabNorm < 65 ||
            new XY(x, y).minus(offset.plus(131).minus(1, 1)).TaxicabNorm < 65) {
            if (v === 'O') aCount++
            colors.push(BgYellow)
        }

        if (new XY(x, y).minus(offset).plus(-65, -65 + 131).TaxicabNorm <= 65) {
            colors.push(BgGreen)
        }

        if (new XY(x, y).minus(offset).plus(-65, -65).TaxicabNorm <= 65) {
            if (v === 'O') bCount++
            colors.push(BgRed)
        }


        if (colors.length > 1) 
            return BgCyan + v
        return (colors[0] ?? '') + v
    }).join(Reset))
})

aCount.Log()
bCount.Log()

console.log(aCount * 81850984601 + bCount * 81850984600)

// arr2.Log()

// tileCounts.Log()

// {
//     const [s, o] = XY.ArraySizeOffset(tileCounts.Keys().map(s => XY.fromString(s)))
//     const arr = new Array2D(s).map((_, xy) => tileCounts[xy.minus(o).toString()].toString().padEnd(8, ' ')).Log()
// }

// 81850984601 A
// 81850984600 B

/*
   /\
  <[]>
   \/

| 978     5733    956
| 5720    7613    5732
| 977     5719    940

= 5733+5732+5719+5720   corners
 + (978 + 956 + 977 + 940) * edges
 + 7613 * inners


*/