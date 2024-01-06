import { Array2D, XY } from "../Glib/XY";
import { DataFull } from "../main";

const arr = Array2D.fromString(DataFull)

const energized = (init: [/*pos*/ XY, /*dir*/ XY]) => {
    const arr3 = arr.map(_ => new Set<XY>())
    const stack = [init]

    while (stack.length > 0) {
        const [pos, dir] = stack.pop()!

        if (arr.get(pos) === undefined) continue

        if (arr3.get(pos)!.has(dir)) continue
        arr3.get(pos)!.add(dir)

        if (arr.get(pos) === '.') {
            stack.push([pos.plus(dir), dir])
        }
        else if (arr.get(pos) === '/') {
            let nDir = null
            if (dir === XY.Down) nDir = XY.Right
            else if (dir === XY.Left) nDir = XY.Up
            else if (dir === XY.Up) nDir = XY.Left
            else if (dir === XY.Right) nDir = XY.Down

            stack.push([pos.plus(nDir!), nDir!])
        }
        else if (arr.get(pos) === '\\') {
            let nDir = null
            if (dir === XY.Down) nDir = XY.Left
            else if (dir === XY.Left) nDir = XY.Down
            else if (dir === XY.Up) nDir = XY.Right
            else if (dir === XY.Right) nDir = XY.Up

            stack.push([pos.plus(nDir!), nDir!])
        }
        else if (arr.get(pos) === '-') {
            if (dir === XY.Right || dir === XY.Left)
                stack.push([pos.plus(dir), dir])
            else {
                stack.push([pos.plus(XY.Right), XY.Right])
                stack.push([pos.plus(XY.Left), XY.Left])
            }
        }
        else if (arr.get(pos) === '|') {
            if (dir === XY.Up || dir === XY.Down)
                stack.push([pos.plus(dir), dir])
            else {
                stack.push([pos.plus(XY.Down), XY.Down])
                stack.push([pos.plus(XY.Up), XY.Up])
            }
        }
    }

    const e = arr3.reduce((sum, v) => sum + (v!.size > 0 ? 1 : 0),0)
    if (e > max) max = e
}

let max = 0

for (let y = 0; y < arr.Size.Y; y++) {
    energized([new XY(0, y), XY.Right])
    energized([new XY(arr.Size.X - 1, y), XY.Left])
}

for (let x = 0; x < arr.Size.X; x++) {
    energized([new XY(x, 0), XY.Up])
    energized([new XY(x, arr.Size.Y - 1), XY.Down])
}

max.Log()