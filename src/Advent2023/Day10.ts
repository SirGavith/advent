import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";

const arr = Array2D.fromArray(Data.map(l => l.toArray()))
const arr2 = new Array2D<string>(arr.Size)

const origin = arr.Find('S')!.Log()

let offset = XY.Right

arr2.set(origin, 'S')

let pathLen = 1

let current = origin.plus(offset)

while (true) {
    if (arr.get(current) === 'S') break

    switch (arr.get(current)) {
        case 'L':
            if (offset.EQ(XY.Up))        offset = XY.Right
            else if (offset.EQ(XY.Left)) offset = XY.Down
            break
        case 'J':
            if (offset.EQ(XY.Up))         offset = XY.Left
            else if (offset.EQ(XY.Right)) offset = XY.Down
            break
        case '7':
            if (offset.EQ(XY.Down))       offset = XY.Left
            else if (offset.EQ(XY.Right)) offset = XY.Up
            break
        case 'F':
            if (offset.EQ(XY.Down))       offset = XY.Right
            else if (offset.EQ(XY.Left))  offset = XY.Up
            break
    }
    arr2.set(current, arr.get(current))
    current = current.plus(offset)
    pathLen++
}

console.log(pathLen/2)

let count = 0
let dir = XY.Zero

for (let y = 0; y < arr2.Size.Y; y++) {
    let counter = 0

    for (let x = 0; x < arr2.Size.X; x++) {
        const xy = new XY(x, y)
        const char = arr2.get(xy)

        if (char === '|') counter++
        else if (char === 'L') {
            counter += 0.5
            dir = XY.Down
        }
        else if (char === 'F') {
            counter += 0.5
            dir = XY.Up
        }
        else if (char === '7') {
            if (dir === XY.Down) counter += 0.5
            if (dir === XY.Up) counter += 1.5
        }
        else if (char === 'J') {
            if (dir === XY.Down) counter += 1.5
            if (dir === XY.Up) counter += 0.5
        }
        else if (char === undefined && counter % 2 === 1)
            count++
    }
}

count.Log()