import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";


function is_xmas(arr: string[], i: number, forward: boolean) {
    if (forward) return arr[i] === 'X' && arr[i + 1] === 'M' && arr[i + 2] === 'A' && arr[i + 3] === 'S'
    else return arr[i] === 'X' && arr[i - 1] === 'M' && arr[i-2] === 'A' && arr[i-3] === 'S'
}

function count_horiz_xmas(arr: string[][]) {
    let c = 0
    arr.forEach(line => {
        let rc = 0
        for (let i = 0; i < line.length - 3; i++) {
            if (is_xmas(line as string[], i, true)) rc++
        }
        for (let i = line.length - 1; i >= 3; i--) {
            if (is_xmas(line as string[], i, false)) rc++
        }
        c += rc
        console.log('Checking row', line.join(''), rc)
    })
    return c
}   

let a = Array2D.fromString(DataFull)

// Part 1
// count += count_horiz_xmas(a.Array as string[][]).Log()
// a = a.Transpose().Log()
// count += count_horiz_xmas(a.Array as string[][]).Log()
// count += count_horiz_xmas(a.Diagonals().filter(r => r.length >= 4)).Log()
// a.Array.forEach(row => row.reverse())
// count += count_horiz_xmas(a.Diagonals().filter(r => r.length >= 4)).Log()


a.Size.minus(1).CountCombinations(xy => 
    a.get(xy) === 'A' &&
    ['M', 'S'].Intersect([a.get(xy.plus(XY.UpLeft))!, a.get(xy.plus(XY.DownRight))!]).length === 2 && 
    ['M', 'S'].Intersect([a.get(xy.plus(XY.UpRight))!, a.get(xy.plus(XY.DownLeft))!]).length === 2,
XY.One).Log()