import { Array2D, XY } from "../Glib/XY";
import { Data } from "../main";

const arr = Array2D.fromArray(Data.map(l => l.toArray()))

const origin = arr.Find('S')!.Log()

const path = [origin]

let offset = XY.Right
path.push(origin.plus(offset))

while (true) {
    const current = path.at(-1)!
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
    path.push(current.plus(offset))
}

path.Log();
((path.length - 1) / 2).Log()